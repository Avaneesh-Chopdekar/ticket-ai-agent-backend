import express from "express";
import {
  signup,
  login,
  logout,
  getUser,
  updateUser,
} from "../controllers/user";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/get-user", authenticate, getUser);
router.post("/update-user", authenticate, updateUser);

export default router;
