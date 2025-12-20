import { Router } from "express";
import {
    getArticles,
    getArticleById,
    createArticle,
    deleteArticle,
    updateArticle,
    getArticleVersionHistory,
    getArticleVersionByNumber
} from "../controllers/articlesController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";


const router = Router();

router.get("/:id/versions/:version_number", getArticleVersionByNumber);
router.get("/:id/versions", getArticleVersionHistory);
router.get("/", getArticles);
router.get("/:id", getArticleById);

router.post("/", authMiddleware, createArticle);
router.delete("/:id", authMiddleware, deleteArticle);
router.put("/:id", authMiddleware, updateArticle);


export default router;