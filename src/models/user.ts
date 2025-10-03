import mongoose from "mongoose";
import type { ITimestamp } from "../types/timestamp";

export interface IUser extends mongoose.Document, ITimestamp {
  email: string;
  password: string;
  role: string;
  skills: string[];
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    skills: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", UserSchema);

export default User;
