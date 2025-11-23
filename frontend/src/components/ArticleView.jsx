import styled from "styled-components";
import { Link } from "react-router-dom";

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

function ArticleView({ article }) {
  if (!article) return <p>Loading...</p>;

  return (
    <>
    <BackButton to="/"> ← Back to list </BackButton>
      <h2>{article.title}</h2>

      <div dangerouslySetInnerHTML={{ __html: article.content }} />

      <small>
        Created: {new Date(article.createdAt).toLocaleString()}
      </small>
  </>
  );
}

export default ArticleView;
