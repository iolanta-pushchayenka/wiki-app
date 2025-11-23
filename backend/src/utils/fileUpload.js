import multer from "multer";
import path from "path";
import { UPLOADS_DIR } from "../config.js";

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const base = path
            .basename(file.originalname, ext)
            .replace(/\s+/g, '_')
            .replace(/[^\w.-]/g, '')
            .slice(0, 100);
        const uniqueName = `${base}_${Date.now()}${ext}`;
        cb(null, uniqueName);
    },
});

const allowedMime = ["image/jpeg", "image/png", "application/pdf"];

const fileFilter = (req, file, cb) => {
    if (allowedMime.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Разрешены только JPG/PNG/PDF"));
};

export const upload = multer({
    storage: fileStorage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 },
});    

