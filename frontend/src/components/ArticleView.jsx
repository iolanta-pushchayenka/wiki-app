import {  Link } from "react-router-dom";
import styled from "styled-components";

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

export default function ArticleView({ article }) {

  if (!article) return <p>Loading...</p>;

  return (
    <>
      <BackButton to="/"> ← Back to workspaces </BackButton>

      <h2 style={{ marginLeft: "25px" }}>{article.title}</h2>

      <div
        style={{ margin: "25px", marginTop: "10px" }}
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <small style={{ marginLeft: "25px", color: "#666" }}>
        Created: {new Date(article.createdAt).toLocaleString()}
      </small>
    </>
  );
}
