import { Router } from "express";
import { uploadAttachment, deleteAttachment } from "../controllers/attachmentsController.js";
import { upload } from "../utils/fileUpload.js";

const router = Router();

// upload
router.post("/:id/attachments", upload.single("file"), uploadAttachment);

// delete
router.delete("/:id/attachments/:attachmentId", deleteAttachment);

export default router;

