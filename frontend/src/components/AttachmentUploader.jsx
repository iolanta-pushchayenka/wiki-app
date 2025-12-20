import React, { useState } from "react";
import api from "../api/axios";
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

      const res = await api.post(
        `/articles/${articleId}/attachments`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("upload response:", res.data);

      if (onUploaded && res.data && res.data.attachment) {
        onUploaded(res.data.attachment);
      } else {
        console.warn("Upload succeeded but no attachment in response", res.data);
      }

      setFile(null);
    } catch (err) {
      console.error("Upload error:", err);
      alert(err.response?.data?.error || "Ошибка загрузки файла");
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
          accept=".jpg, .jpeg, .png, .pdf"
          style={{ display: "none" }}
          onChange={(e) => setFile(e.target.files[0])}
        />
      </label>

      <p>JPG, PNG, PDF (max size 10MB!)</p>

      <button disabled={!file || loading} onClick={handleUpload}>
        {loading ? "Uploading..." : "Upload"}
      </button>
    </UploadBox>
  );
}
