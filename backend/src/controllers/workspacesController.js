import { sendNotification } from "../utils/websocket.js";
import db from "../../models/index.js";
const { Workspace, Article, ArticleVersion } = db;

//POST create workspace
export async function createWorkspace(req, res) {
  try {
    const { name } = req.body
    const userId = req.user.userId;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const workspace = await Workspace.create({ name, userId });

    res.status(201).json(workspace);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to create workspace" });
  }
}

//GET get workspaces 
export async function getWorkspaces(req, res) {
  try {
    const workspaces = await Workspace.findAll({
      order: [["id", "ASC"]]
    });

    return res.json(workspaces);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch workspaces" });
  }
}


//DELETE  delete workspace 
export async function deleteWorkspace(req, res) {
  try {
    const { id } = req.params;

    const workspace = await Workspace.findByPk(id);

    if (!workspace) {
      return res.status(401).json({ error: "Workspace not found" })
    }

    if (workspace.userId !== req.user.userId) {
      return res.status(403).json({ error: "You cannot delete this workspace" });
    }


    await workspace.destroy();

    res.json({ message: "Workspace deleted" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete workspace" });
  }
}

//create workspace article 
export async function createWorkspaceArticle(req, res) {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user.userId;

    const workspace = await Workspace.findByPk(id);
    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    if (workspace.userId !== userId) {
      return res.status(403).json({ error: "You cannot create articles in someone else's workspace" });
    }


    const article = await Article.create({
      workspaceId: id,
      userId
    });

    const version = await ArticleVersion.create({
      articleId: article.id,
      title,
      content,
      versionNumber: 1,
      attachments: []
    });

    res.status(201).json({ article, version });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create article" });
  }
}



export async function getWorkspaceArticles(req, res) {
  try {
    const { id } = req.params;

    const articles = await Article.findAll({
      where: { workspaceId: id },
      include: [
        {
          model: ArticleVersion,
          as: "ArticleVersions",
          order: [["versionNumber", "DESC"]],
          limit: 1
        }
      ]
    });

    res.json(articles);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to load articles" });
  }
}


export async function getWorkspaceArticleById(req, res) {
  try {
    const { id, articleId } = req.params;

    const article = await Article.findOne({
      where: {
        id: articleId,
        workspaceId: id
      },
      include: [{
        model: ArticleVersion,
        as: "ArticleVersions",
        separate: true,
        order: [["versionNumber", "DESC"]],
      }]
    });

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    const json = article.toJSON();
    json.latestVersion = json.ArticleVersions?.[0] || null;

    res.json(json);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load article" });
  }
}


export async function updateWorkspaceArticle(req, res) {
  try {
    const { id, articleId } = req.params;
    const { title, content, attachments = [] } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const article = await Article.findOne({
      where: { id: articleId, workspaceId: id }
    });

    if (!article) {
      return res.status(404).json({ error: "Article not found in this workspace" });
    }

    if (article.userId !== req.user.userId) {
      return res.status(403).json({ error: "You cannot edit this article" });
    }


    const lastVersionNumber =
      (await ArticleVersion.max("versionNumber", { where: { articleId: article.id } })) || 0;

    const newVersion = await ArticleVersion.create({
      articleId: article.id,
      title,
      content,
      attachments: attachments.map(a => JSON.parse(JSON.stringify(a))),
      versionNumber: lastVersionNumber + 1
    });

    article.updatedAt = new Date();
    await article.save();

    sendNotification(`Article "${title}" updated`);

    res.json({ article, version: newVersion });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update article" });
  }
}
