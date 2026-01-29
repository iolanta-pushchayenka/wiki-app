import db from "../../models/index.js";
import { generateArticlePdf } from "../services/articlePdfService.js";

const { Article, ArticleVersion, User } = db;

export async function exportArticleAsPdf(req, res) {
    try {
        const { id } = req.params;

        // 1. Article
        const article = await Article.findByPk(id, {
            include: [
                {
                    model: User,
                    attributes: ["email"]
                }
            ]
        });

        if (!article) {
            return res.status(404).json({ error: "Article not found" });
        }

        // 2. Latest version
        const latestVersion = await ArticleVersion.findOne({
            where: { articleId: id },
            order: [["versionNumber", "DESC"]]
        });

        if (!latestVersion) {
            return res.status(404).json({ error: "Article version not found" });
        }

        // 3. Generate PDF
        generateArticlePdf(res, {
            title: latestVersion.title,
            content: latestVersion.content,
            authorEmail: article.User?.email,
            createdAt: latestVersion.createdAt
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to export PDF" });
    }
}
