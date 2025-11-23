import { Router } from "express";
import {
    getArticles,
    getArticleById,
    createArticle,
    deleteArticle,
    updateArticle,
} from "../controllers/articlesController.js";

const router = Router();

router.get("/", getArticles);
router.get("/:id", getArticleById);
router.post("/", createArticle);
router.delete("/:id", deleteArticle);
router.put("/:id", updateArticle);

export default router;