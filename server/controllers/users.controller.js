import dataSource from "../db/db.js";
import User from "../entities/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userRepo = dataSource.getRepository("User");

export const SignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    const user = await userRepo.findOne({ where: { email } });
    if (user) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const hashPassword = await bcrypt.hash(password.toString(), 10);

    const newUser = userRepo.create({
      name,
      email,
      password: hashPassword,
    });

    await userRepo.save(newUser);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "SignUp failed. Please try again later.",
    });
  }
};

export const SignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    const user = await userRepo.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Incorrect email!",
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      password.toString(),
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password!",
      });
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      "Secret_Key",
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      "Refresh_Secret_Key",
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: `${user.name} welcome back!`,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "SignIn failed. Please try again later.",
    });
  }
};
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token is missing.",
    });
  }

  jwt.verify(refreshToken, "Refresh_Secret_Key", (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired refresh token.",
      });
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      "Secret_Key",
      { expiresIn: "15m" }
    );

    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully.",
      accessToken: newAccessToken,
    });
  });
}