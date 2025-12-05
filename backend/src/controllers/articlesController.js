import fs from "fs/promises";
import path from "path";
import { DATA_DIR } from "../config.js";
import { makeSafeFilename } from "../utils/safeFileName.js";
import { sendNotification } from "../utils/websocket.js";

import db from "../../models/index.js";
const { Article } = db;


// GET all articles
export async function getArticles(req, res) {
    try {
        const { workspaceId, limit, offset } = req.query;

        const where = {};
        if (workspaceId) {
            where.workspaceId = Number(workspaceId);
        }

        const queryOptions = {
            where,
            attributes: ['id', 'title', 'content', 'createdAt', 'updatedAt', 'workspaceId'],
            order: [['createdAt', 'DESC']]
        };

        if (limit) queryOptions.limit = Number(limit);
        if (offset) queryOptions.offset = Number(offset);

        const articles = await Article.findAll(queryOptions);

        res.json(articles);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
}


// GET article by id 
export async function getArticleById(req, res) {
    try {
        const id = req.params.id

        const article = await Article.findByPk(id, {
    include: [{
        model: db.Comment,
        as: "Comments",
        attributes: ["id", "content", "createdAt", "updatedAt"]
    }]
});

        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }

        res.json(article);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch article' });
    }
}


// POST create article
export async function createArticle(req, res) {
    try {
        const {title, content, workspaceId} = req.body;

        if (!title || !content || !workspaceId) {
            return res.status(400).json({error: "Title, content and workspaceId are required"})
        }

        const attachment = [];

        const article = await Article.create({
            title,
            content, 
            attachment,
            workspaceId
        });

        res.status(201).json(article);
    } catch (err){ 
        console.log(err);
        res.status(500).json({ error: "Failed to create article" });
    }
}


// DELETE article
export async function deleteArticle(req, res) {
    try {
        const id = req.params.id;

        const article = await Article.findByPk(id);
        if (!article) {
            return res.status(404).json({error: "Article not found"});
        }

          // Удаляем статью
        await article.destroy();

        return res.json({ message: "Article deleted successfully" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Delete error" });
    }
}


// PUT update
export async function updateArticle(req, res) {
    try {
        const id = req.params.id;
        const {title, content} = req.body;

        if (!title || !content) {
            return res.status(400).json({error: "Missing fields"});
        }

        const article = await Article.findByPk(id);
        if (!article) {
            return res.status(404).json({error: "Article not found"});
        }

        article.title = title;
        article.content = content;
        article.updatedAt = new Date();

        await article.save();

        sendNotification(`Article "${title}" updated`);

        return res.json(article);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Update error" });
    }
};