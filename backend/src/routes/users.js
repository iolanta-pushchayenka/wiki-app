import express from "express";
import { getUsers, updateUserRole } from "../controllers/usersController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router();

router.get("/",authMiddleware, requireAdmin, getUsers);

router.patch("/:id/role",authMiddleware, requireAdmin, updateUserRole);

export default router;