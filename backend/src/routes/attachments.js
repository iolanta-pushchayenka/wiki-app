import { Router } from "express";
import { uploadAttachment, deleteAttachment } from "../controllers/attachmentsController.js";
import { upload } from "../utils/fileUpload.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

// upload
router.post("/:id/attachments", authMiddleware, upload.single("file"), uploadAttachment);

// delete
router.delete("/:id/attachments/:attachmentId", authMiddleware, deleteAttachment);

export default router;

