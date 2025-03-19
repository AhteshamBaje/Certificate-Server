import Register from "../models/RegisterModel.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
const LoginApi = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Find user by name
    const user = await Register.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

     // Generate JWT token
     const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET || "Ahtesham006",
        { expiresIn: "1h" }
      );

    res.status(200).json({ message: "User logged in successfully" , token});
  } catch (error) {
    console.error("Login Error:", error); // Log the actual error
    res.status(500).json({ error: error.message || "Error logging in user" });
  }
};

export default LoginApi;
