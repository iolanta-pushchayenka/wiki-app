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

const router = Router();

router.get("/", getWorkspaces);
router.post("/", createWorkspace);
router.delete("/:id", deleteWorkspace);
router.get("/:id/articles", getWorkspaceArticles);
router.post("/:id/articles", createWorkspaceArticle);

router.get("/:id/articles/:articleId", getWorkspaceArticleById);
router.put("/:id/articles/:articleId", updateWorkspaceArticle); 


export default router;
 