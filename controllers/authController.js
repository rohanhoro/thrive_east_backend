import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Enquiry from "../models/Enquiry.js";
import User from "../models/User.js";

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const matchedUser = await bcrypt.compare(password, user.password);
    if (!matchedUser)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Sets the token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login Successful" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userExists = await User.findOne({ username });
    if (userExists)
      return res.status(409).json({ error: "Username already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

const verify = (req, res) => {
  res.sendStatus(200);
};

const enquiries = (req, res) => {
  const { name, email, contactnumber, service, message } = req.body;
  try {
    const newEnquiry = new Enquiry({
      name,
      email,
      contactnumber,
      service,
      message,
    });
    newEnquiry.save();
    res.status(200).json("Enquiry saved successfully");
  } catch (error) {
    res.status(500).json(error);
  }
};

const getenquiries = async (req, res) => {
  const enquiries = await Enquiry.find().sort({ createdAt: -1 });
  res.status(200).json(enquiries);
};

const countNewEnquiries = async (req, res) => {
  const counted = await Enquiry.countDocuments({ isRead: false });
  res.status(200).json({ count: counted });
};

const deleteEnquiries = async (req, res) => {
  const { id } = req.params;
  try {
    await Enquiry.updateOne({ _id: id }, { isDeleted: true });
    res.sendStatus(200);
  } catch (error) {
    res.status(404).json("Database error");
  }
};
const restoreEnquiries = async (req, res) => {
  const { id } = req.params;
  try {
    await Enquiry.updateOne({ _id: id }, { isDeleted: false });
    res.sendStatus(200);
  } catch (error) {
    res.status(404).json("Database error");
  }
};

export {
  countNewEnquiries,
  deleteEnquiries,
  enquiries,
  getenquiries,
  login,
  logout,
  register,
  restoreEnquiries,
  verify,
};
