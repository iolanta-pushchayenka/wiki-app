import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";

const ExportButton = styled.button`
  display: inline-block;
  padding: 8px 12px;
  background-color: #afeeee;
  color: black;
  border: none;
  border-radius: 4px;
  margin-left: 25px;
  margin-bottom: 20px;
  cursor: pointer;
  width: 10%;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const BackButton = styled(Link)`
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-decoration: none;
  color: black;
  font-size: 14px;
  width: 10%;
  margin-left: 25px;

  &:hover {
    background-color: #f0f0f0;
  }
`;

export default function ArticleView() {
  const { wsId, articleId } = useParams();
  const { token } = useAuth();

  const [article, setArticle] = useState(null);
  const [version, setVersion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticle() {
      try {
        const res = await api.get(
          `/workspaces/${wsId}/articles/${articleId}`
        );

        const a = res.data;
        const v = a.latestVersion;

        if (!v) throw new Error("No version found");

        setArticle(a);
        setVersion(v);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    }

    loadArticle();
  }, [wsId, articleId]);

  const handleDownloadPdf = async () => {
    try {
      if (!token) {
        throw new Error("User is not authenticated");
      }

      const response = await fetch(
        `http://localhost:3000/articles/${articleId}/export/pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Status:", response.status);
      console.log("Content-Type:", response.headers.get("Content-Type"));

      if (!response.ok) {
        throw new Error(`Ошибка при скачивании PDF: ${response.status}`);
      }

      if (!response.headers.get("Content-Type")?.includes("pdf")) {
        const text = await response.text();
        console.error("Not a PDF response:", text);
        throw new Error("Сервер вернул не PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${version.title.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <BackButton to="/"> ← Back to workspaces </BackButton>

      <Link
        to={`/workspaces/${wsId}/articles/${articleId}/versions`}
        style={{
          padding: "8px 12px",
          background: "#afeeee",
          borderRadius: "4px",
          textDecoration: "none",
          color: "black",
          width: "width: 10%",
          marginBottom: "20px",
          display: "inline-block",
          width: "140px",
          marginLeft: "25px",
        }}
      >
        View Versions History
      </Link>

      <ExportButton onClick={handleDownloadPdf}>
        Export as PDF
      </ExportButton>

      <h2 style={{ marginLeft: "25px" }}>{version.title}</h2>

      <div
        style={{ margin: "25px", marginTop: "10px" }}
        dangerouslySetInnerHTML={{ __html: version.content }}
      />

      <small style={{ marginLeft: "25px", color: "#666" }}>
        Created: {new Date(version.createdAt).toLocaleString()}
      </small>
    </>
  );
}
