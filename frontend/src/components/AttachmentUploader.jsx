import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";

const UploadBox = styled.div`
  display: inline-block;
  border: 2px dashed #afeeee;
  border-radius: 10px;
  text-align: center;
  padding: 20px 30px; 
`;

export default function AttachmentUploader({ articleId, onUploaded }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

    if (!allowedTypes.includes(file.type)) {
      alert("Разрешены только JPG, PNG и PDF");
      setFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Максимальный размер файла — 10 MB");
      setFile(null);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await axios.post(
        `http://localhost:3000/articles/${articleId}/attachments`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      onUploaded(res.data.attachment);
      setFile(null);

    } catch (err) {
      alert(err.response?.data?.error || "Ошибка загрузки файла");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UploadBox>
      <label style={{ cursor: "pointer", color: "#afeeee" }}>
        Click to upload file
        <input
          type="file"
          style={{ display: "none" }}
          onChange={(e) => setFile(e.target.files[0])}
        />
      </label>

      <p>JPG, PNG, PDF (max size 10MB)</p>

      <button
        disabled={!file || loading}
        onClick={handleUpload}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </UploadBox>
  );
}
