import { Router } from "express";
import { createComment, getComments, deleteComment, updateComment } from "../controllers/commentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

// GET all comments for article
router.get("/:id/comments", getComments);

// PUT update comment 
router.put("/comment/:commentId", authMiddleware, updateComment);

// POST create comment
router.post("/:id/comments", authMiddleware, createComment);

// DELETE comment
router.delete("/comment/:commentId", authMiddleware, deleteComment);

export default router;
