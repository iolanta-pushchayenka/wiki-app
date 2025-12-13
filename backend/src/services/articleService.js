import db from "../../models/index.js";
import _ from "lodash";
const { Article, ArticleVersion } = db;

class ArticleService {

    static async createArticle({ title, content, attachments = [], workspaceId }) {
        return db.sequelize.transaction(async (t) => {
            const article = await Article.create({ workspaceId }, { transaction: t });

            const clonedAttachments = _.cloneDeep(attachments);

            const version = await ArticleVersion.create({
                articleId: article.id,
                title,
                content,
                attachments: clonedAttachments,
                versionNumber: 1
            }, { transaction: t });

            return { article, version };
        });
    }

    static async createNewVersion(articleId, { title, content, attachments = [] }) {
        return db.sequelize.transaction(async (t) => {
            const lastVersion = await ArticleVersion.findOne({
                where: { articleId },
                order: [["versionNumber", "DESC"]],
                transaction: t
            });

            if (!lastVersion) {
                throw new Error("Last version not found");
            }

            const newAttachments = _.cloneDeep(attachments);

            const newVersion = await ArticleVersion.create({
                articleId,
                title,
                content,
                attachments: newAttachments,
                versionNumber: lastVersion.versionNumber + 1
            }, { transaction: t });

            return newVersion;
        });
    }

    static async getLatestVersion(articleId) {
        return ArticleVersion.findOne({
            where: { articleId },
            order: [["versionNumber", "DESC"]],
        });
    }

    static async getVersionHistory(articleId) {
        return ArticleVersion.findAll({
            where: { articleId },
            order: [["versionNumber", "ASC"]],
        });
    }

    static async getVersionByNumber(articleId, versionNumber) {
        return ArticleVersion.findOne({
            where: { articleId, versionNumber }
        });
    }
}

export default ArticleService;

