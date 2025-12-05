import { sendNotification } from "../utils/websocket.js";
import db from "../../models/index.js";
const { Workspace, Article } = db;

//POST create workspace
export async function createWorkspace(req, res) {
    try{
        const {name} = req.body

        if(!name){
            return res.status(400).json({error: "Name is required"});
        }

        const workspace = await Workspace.create({name});

        res.status(201).json(workspace);

    } catch(err){
        console.log(err);
        res.status(500).json({error: "Failed to create workspace"});
    }
}

//GET get workspaces 
export async function getWorkspaces(req, res) {
    try{
        const workspaces = await Workspace.findAll({
            order: [["id", "ASC"]]
        });

        return res.json(workspaces);

    } catch(err){
        console.error(err);
        res.status(500).json({ error: "Failed to fetch workspaces" });
    }
}


//DELETE  delete workspace 
export async function deleteWorkspace(req, res) {
    try{
        const{id} = req.params;

        const workspace = await Workspace.findByPk(id);

        if(!workspace){
            return res.status(401).json({ error: "Workspace not found" })
        }

        await workspace.destroy();

        res.json({ message: "Workspace deleted" });

    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete workspace" });
    }
}

//get
export async function getWorkspaceArticles(req, res) {
    try {
        const { id } = req.params;
        const articles = await Article.findAll({
            where: { workspaceId: id },
            order: [["id", "ASC"]]
        });

        res.json(articles);
    } catch (err) {
        res.status(500).json({ error: "Failed to load articles" });
    }
}

export async function createWorkspaceArticle(req, res) {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const article = await Article.create({
            title,
            content,
            workspaceId: id
        });

        res.status(201).json(article);
    } catch (err) {
        res.status(500).json({ error: "Failed to create article" });
    }
}



export async function getWorkspaceArticleById(req, res) {
    try {
        const { id, articleId } = req.params;

        const article = await Article.findOne({
            where: {
                id: articleId,
                workspaceId: id
            }
        });

        if (!article) {
            return res.status(404).json({ error: "Article not found" });
        }

        res.json(article);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to load article" });
    }
}


export async function updateWorkspaceArticle(req, res) {
    try {
        const { id, articleId } = req.params;
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: "Title and content are required" });
        }

        const article = await Article.findOne({
            where: {
                id: articleId,
                workspaceId: id
            }
        });

        if (!article) {
            return res.status(404).json({ error: "Article not found in this workspace" });
        }

        article.title = title;
        article.content = content;
        article.updatedAt = new Date();

        await article.save();

        sendNotification(`Article "${title}" updated`);

        res.json(article);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update article" });
    }
}
