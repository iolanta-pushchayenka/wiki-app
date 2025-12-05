import { Router } from "express";
import { createComment, getComments, deleteComment, updateComment } from "../controllers/commentController.js";

const router = Router();

// GET all comments for article
router.get("/:id/comments", getComments);

// PUT update comment 
router.put("/comment/:commentId", updateComment);

// POST create comment
router.post("/:id/comments", createComment);

// DELETE comment
router.delete("/comment/:commentId", deleteComment);

export default router;
