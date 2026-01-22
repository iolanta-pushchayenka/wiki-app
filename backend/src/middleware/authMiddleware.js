import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";


export function authMiddleware(req, res, next) {
    if (!JWT_SECRET) {
        console.error("JWT_SECRET is not defined in environment variables");
        return res.status(500).json({ message: "Server configuration error" });
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header missing" });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({ message: "Invalid authorization format" });
    }

    const token = parts[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token is invalid or expired" });
    }
}
