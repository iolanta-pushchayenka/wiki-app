import { Router } from "express";

import {
    getWorkspaces,
    createWorkspace,
    deleteWorkspace,
    getWorkspaceArticles, 
    createWorkspaceArticle,
    getWorkspaceArticleById,
    updateWorkspaceArticle
} from "../controllers/workspacesController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, getWorkspaces);
router.post("/", authMiddleware,  createWorkspace);
router.delete("/:id", authMiddleware, deleteWorkspace);

router.get("/:id/articles", authMiddleware, getWorkspaceArticles);
router.post("/:id/articles", authMiddleware, createWorkspaceArticle);

router.get("/:id/articles/:articleId", authMiddleware, getWorkspaceArticleById);
router.put("/:id/articles/:articleId", authMiddleware, updateWorkspaceArticle); 


export default router;
