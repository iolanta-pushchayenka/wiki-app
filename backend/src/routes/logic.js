import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/data", authMiddleware, (req, res) => {
    res.json({
        message: "You have access to protected logic data",
        user: req.user
    });
});

export default router;
