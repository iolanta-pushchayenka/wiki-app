import { Router } from "express";
import {
    getArticles,
    getArticleById,
    createArticle,
    deleteArticle,
    updateArticle,
    getArticleVersionHistory,
    getArticleVersionByNumber,
    searchArticles
} from "../controllers/articlesController.js";


import { exportArticleAsPdf } from "../controllers/articlePdfController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";




const router = Router();

router.get("/:id/versions/:version_number", authMiddleware, getArticleVersionByNumber);
router.get("/:id/versions", authMiddleware, getArticleVersionHistory);
router.get("/search", authMiddleware, searchArticles);
router.get("/", authMiddleware, getArticles);
router.get("/:id/export/pdf", authMiddleware, exportArticleAsPdf);
router.get("/:id", authMiddleware, getArticleById);


router.post("/", authMiddleware, createArticle);
router.delete("/:id", authMiddleware, deleteArticle);
router.put("/:id", authMiddleware, updateArticle);


export default router;