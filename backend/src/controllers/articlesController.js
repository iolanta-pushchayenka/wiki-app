import db from "../../models/index.js";
import { canEditResource } from "../utils/permissions.js";
import { Op } from "sequelize";

const { Article, ArticleVersion, Comment } = db;


// GET all articles
export async function getArticles(req, res) {
    try {
        const { workspaceId, limit, offset } = req.query;
        const where = {};
        if (workspaceId) where.workspaceId = Number(workspaceId);

        const articles = await Article.findAll({
            where,
            order: [['createdAt', 'DESC']],
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            include: [{
                model: ArticleVersion,
                as: "ArticleVersions",
                order: [["versionNumber", "DESC"]], 
                limit: 1
            }]
        });

        res.json(articles);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch articles" });
    }
}

// GET article by id
export async function getArticleById(req, res) {
    try {
        const { id } = req.params;

        const article = await Article.findByPk(id, {
            include: [{
                model: Comment,
                as: "Comments",
                attributes: ["id", "content", "createdAt", "updatedAt"]
            }]
        });
        if (!article) return res.status(404).json({ error: "Article not found" });

        const latestVersion = await ArticleVersion.findOne({
            where: { articleId: id },
            order: [["versionNumber", "DESC"]]
        });

        res.json({ ...article.toJSON(), latestVersion });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch article" });
    }
}

// CREATE article
export async function createArticle(req, res) {
    try {
        const { title, content, workspaceId, attachments = [] } = req.body;
        const userId = req.user.userId;

        if (!title || !content || !workspaceId) {
            return res.status(400).json({ error: "Title, content and workspaceId are required" });
        }

        const article = await Article.create({ workspaceId, userId });

        const version = await ArticleVersion.create({
            articleId: article.id,
            title,
            content,
            attachments: attachments.map(att => ({ ...att })),
            versionNumber: 1
        });

        res.status(201).json({ article, version });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create article" });
    }
}

// DELETE article
export async function deleteArticle(req, res) {
    try {
        const { id } = req.params;

        const article = await Article.findByPk(id);
        if (!article) {
            return res.status(404).json({ error: "Article not found" });
        };

        // проверка прав
        if (!canEditResource(article.userId, req.user)) {
            return res.status(403).json({ error: "You do not have permission" });
        }

        await ArticleVersion.destroy({ where: { articleId: id } });
        await article.destroy();

        res.json({ message: "Article deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Delete error" });
    }
}

// UPDATE article 
export async function updateArticle(req, res) {
    try {
        const { id } = req.params;
        const { title, content, attachments } = req.body;

        const lastVersion = await ArticleVersion.findOne({
            where: { articleId: id },
            order: [["versionNumber", "DESC"]],
        });
        if (!lastVersion) return res.status(404).json({ error: "Article version not found" });

        const newTitle = title !== undefined ? title : lastVersion.title;
        const newContent = content !== undefined ? content : lastVersion.content;
        const newAttachments = attachments !== undefined ? attachments : lastVersion.attachments;

        const isChanged =
            newTitle !== lastVersion.title ||
            newContent !== lastVersion.content ||
            JSON.stringify(newAttachments) !== JSON.stringify(lastVersion.attachments);

        if (!isChanged) {
            return res.json({ message: "No changes detected", version: lastVersion });
        }

        const article = await Article.findByPk(id);
        if (!article) return res.status(404).json({ error: "Article not found" });

        // проверка владельца
        if (!canEditResource(article.userId, req.user)) {
            return res.status(403).json({ error: "You cannot edit this article" });
        }

        const newVersion = await ArticleVersion.create({
            articleId: id,
            title: newTitle,
            content: newContent,
            attachments: newAttachments.map(att => ({ ...att })),
            versionNumber: lastVersion.versionNumber + 1,
        });

        return res.json(newVersion);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to update article" });
    }
};

// GET version history
export async function getArticleVersionHistory(req, res) {
    try {
        const { id } = req.params;
        const article = await Article.findByPk(id);
        if (!article) return res.status(404).json({ error: "Article not found" });

        const versions = await ArticleVersion.findAll({
            where: { articleId: id },
            order: [["versionNumber", "ASC"]]
        });

        res.json(versions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch version history" });
    }
}

// GET article version by number
export async function getArticleVersionByNumber(req, res) {
    try {
        const { id, version_number } = req.params;
        const version = await ArticleVersion.findOne({
            where: { articleId: id, versionNumber: Number(version_number) }
        });
        if (!version) return res.status(404).json({ error: "Version not found" });


        const latestVersion = await ArticleVersion.findOne({
            where: { articleId: id },
            order: [["versionNumber", "DESC"]]
        });

        res.json({
            ...version.toJSON(),
            isLatest: version.versionNumber === latestVersion.versionNumber,
            isEditable: version.versionNumber === latestVersion.versionNumber
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch version" });
    }
}


export async function searchArticles(req, res) {
    try {
        const { search = "", workspaceId, limit = 50, page = 1 } = req.query;
        const searchText = search.trim();

        const parsedLimit = Number(limit);
        const parsedPage = Number(page);
        const offset = (parsedPage - 1) * parsedLimit;

        const { Article, ArticleVersion, sequelize } = db;

        const latestVersionSubquery = sequelize.literal(`(
        SELECT MAX(av."versionNumber")
        FROM "ArticleVersions" av
        WHERE av."articleId" = "Article"."id"
    )`);

        const articles = await Article.findAll({
            attributes: ["id", "workspaceId", "userId"],
            where: workspaceId ? { workspaceId: Number(workspaceId) } : {},
            include: [
                {
                    model: ArticleVersion,
                    as: "ArticleVersions",
                    attributes: ["title", "content", "versionNumber", "createdAt", "updatedAt"],
                    required: true,
                    where: {
                        versionNumber: {
                            [Op.eq]: latestVersionSubquery
                        },
                        ...(searchText && {
                            [Op.or]: [
                                { title: { [Op.iLike]: `%${searchText}%` } },
                                { content: { [Op.iLike]: `%${searchText}%` } }
                            ]
                        })
                    }
                }
            ],
            order: [[
                { model: ArticleVersion, as: "ArticleVersions" },
                "createdAt",
                "DESC"
            ]],

            limit: parsedLimit,
            offset
        });

        const formatted = articles.map(a => {
            const latest = a.ArticleVersions[0];
            return {
                articleId: a.id,
                workspaceId: a.workspaceId,
                userId: a.userId,
                title: latest.title,
                content: latest.content,
                versionNumber: latest.versionNumber,
                createdAt: latest.createdAt,
                updatedAt: latest.updatedAt
            };
        });

        return res.status(200).json({
            page: parsedPage,
            limit: parsedLimit,
            total: formatted.length,
            articles: formatted
        });

    } catch (err) {
        console.error("searchArticles error:", err);
        return res.status(500).json({
            error: err.message || "Failed to search articles"
        });
    }
}


