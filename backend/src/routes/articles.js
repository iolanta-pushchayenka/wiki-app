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

const router = Router();

router.get("/:id/versions/:version_number", getArticleVersionByNumber);
router.get("/:id/versions", getArticleVersionHistory);
router.get("/", getArticles);
router.get("/:id", getArticleById);
router.post("/", createArticle);
router.delete("/:id", deleteArticle);
router.put("/:id", updateArticle);


export default router;