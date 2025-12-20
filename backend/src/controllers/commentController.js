import db from "../../models/index.js";
const { Comment, Article } = db;

// Create comment
export async function createComment(req, res) {
    try {
        const { id } = req.params; 
        const { content } = req.body;
        const userId = req.user.userId;

        if (!content) {
            return res.status(400).json({ error: "Content is required" });
        }

        const article = await Article.findByPk(id);
        if (!article) {
            return res.status(404).json({ error: "Article not found" });
        }

        const comment = await Comment.create({
            content,
            articleId: id,
            userId
        });

        return res.status(201).json(comment);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to create comment" });
    }
}

//PUT Update comment 
export async function updateComment(req, res) {
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        const userId = req.user.userId;

        const comment = await Comment.findByPk(commentId);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

    
        if (comment.userId !== userId) {
            return res.status(403).json({ error: "You cannot edit this comment" });
        }

        comment.content = content;
        await comment.save();

        res.json(comment);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to update comment" });
    }
}



// Get all comments for article
export async function getComments(req, res) {
    try {
        const { id } = req.params; 

        const article = await Article.findByPk(id);
        if (!article) {
            return res.status(404).json({ error: "Article not found" });
        }

        const comments = await Comment.findAll({
            where: { articleId: id },
            order: [["createdAt", "DESC"]]
        });

        res.json(comments);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch comments" });
    }
}


// Delete comment
export async function deleteComment(req, res) {
    try {
        const { commentId } = req.params;
        const userId = req.user.userId;

        const comment = await Comment.findByPk(commentId);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        
        if (comment.userId !== userId) {
            return res.status(403).json({ error: "You cannot delete this comment" });
        }

        await comment.destroy();

        res.json({ message: "Comment deleted" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Delete failed" });
    }
}
