const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
//const nodemailer = require("nodemailer");

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json("User already exists");
    }
    // const hashPassword= await bcrypt.hash(password,10)
    const newUser = await User.create({
      name,
      email,
      password,
    });
    //await newUser.save();
    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User Not Found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Wrong Password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      domain: "https://courses-api-production.up.railway.app", // Replace with your domain (if different from frontend)
      path: "/", // Set to '/' for access across all paths
      secure: true, // Set to true if your backend is served over HTTPS
      httpOnly: true, // Recommended for additional security
      sameSite: "Lax", // Consider security implications before using
    });
    res.status(200).json({
      message: "User logged in",
      id: user._id,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addCourseToUser = async (req, res) => {
  try {
    // Extract the user ID and course ID from the request body
    const { userId, courseId } = req.params;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the course already exists in the user's courses
    if (user.courses.includes(courseId)) {
      return res.status(400).json({ message: "Course already added to user" });
    }

    // Add the course ID to the user's courses array
    user.courses.push(courseId);

    // Save the updated user object
    await user.save();

    res.status(200).json({ message: "Course added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getUserCourses = async (req, res) => {
  try {
    // Assuming you're passing the user's ID in the request
    const { userId } = req.params;

    // Find the user by ID and populate the 'courses' field to get the course details
    const user = await User.findById(userId).populate("courses");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const userId = res.locals.id;
    console.log(res.locals.id);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json("User Not Found");
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
