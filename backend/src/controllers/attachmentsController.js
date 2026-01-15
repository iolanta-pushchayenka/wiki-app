import db from "../../models/index.js";
import fs from "fs/promises";
import path from "path";
import { canEditResource } from "../utils/permissions.js";

const { ArticleVersion, Article } = db;

// UPLOAD attachment
export async function uploadAttachment(req, res) {
    try {
        const file = req.file;
        const { id } = req.params;

        if (!file) return res.status(400).json({ error: "No file uploaded" });

        const article = await Article.findByPk(id);
        if (!article) return res.status(404).json({ error: "Article not found" });

        
        if (!canEditResource(article.userId,req.user)) {
            return res.status(403).json({ error: "You cannot upload attachments to this article" });
        }

        const attachment = {
            id: `${Date.now()}-${Math.random()}`,
            originalName: file.originalname,
            filename: file.filename,
            mimeType: file.mimetype,
            size: file.size,
            url: `/uploads/${file.filename}`,
            uploadedAt: new Date().toISOString()
        };

        res.status(201).json({ attachment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Upload failed" });
    }
}

// DELETE attachment 
export async function deleteAttachment(req, res) {
    try {
        const { id, attachmentId } = req.params;

        const lastVersion = await ArticleVersion.findOne({
            where: { articleId: id },
            order: [["versionNumber", "DESC"]],
        });
        if (!lastVersion) return res.status(404).json({ error: "Article version not found" });

        const article = await Article.findByPk(id);
        if (!article) return res.status(404).json({ error: "Article not found" });

    
        if (!canEditResource(article.userId,req.user)) {
            return res.status(403).json({ error: "You cannot delete attachments of this article" });
        }

        const attachmentsCopy = (lastVersion.attachments || []).map(att => ({ ...att }));
        const index = attachmentsCopy.findIndex(a => String(a.id) === String(attachmentId));
        if (index === -1) return res.status(404).json({ error: "Attachment not found" });

        const att = attachmentsCopy[index];
        attachmentsCopy.splice(index, 1);

        const otherVersions = await ArticleVersion.findAll({
            where: { articleId: id },
        });
        const isUsedElsewhere = otherVersions.some(v =>
            v.attachments?.some(a => a.filename === att.filename)
        );

        if (!isUsedElsewhere) {
            await fs.unlink(path.join(process.cwd(), "uploads", att.filename)).catch(() => { });
        }

        return res.json({ message: "Attachment deleted", attachments: attachmentsCopy });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Delete failed" });
    }
}
