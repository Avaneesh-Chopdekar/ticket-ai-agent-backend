import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { type IUser } from "../models/user";
import type { Request, Response } from "express";
import { inngest } from "../inngest/client";

export const signup = async (req: Request, res: Response) => {
  const { email, password, skills = [] } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, skills });

    await inngest.send({ name: "user/signup", data: { email } });

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      },
    );
    res.status(201).json({
      user: {
        _id: user._id,
        email: user.email,
        skills: user.skills,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    });
  } catch (error: any) {
    res.status(500).json({ error: "Signup failed", details: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = (await User.findOne({ email })) as IUser | null;
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      },
    );
    res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        skills: user.skills,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    });
  } catch (error: any) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET!, (error, decoded) => {
      if (error) {
        return res.status(401).json({ error: "Unauthorized" });
      }
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error: any) {
    res.status(500).json({ error: "Logout failed", details: error.message });
  }
};
