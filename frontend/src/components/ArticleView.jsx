// import { Link } from "react-router-dom";
// import styled from "styled-components";


// const BackButton = styled(Link)`
//   padding: 6px 10px;
//   border: 1px solid #ccc;
//   border-radius: 4px;
//   text-decoration: none;
//   color: black;
//   font-size: 14px;
//   width: 10%;
//   margin-left: 25px;

//   &:hover {
//     background-color: #f0f0f0;
//   }
// `;

// export default function ArticleView({ articleVersion }) {

//   if (!articleVersion) return <p>Loading...</p>;

//   return (
//     <>
//       <BackButton to="/"> ← Back to workspaces </BackButton>

//       <h2 style={{ marginLeft: "25px" }}>{articleVersion.title}</h2>

//       <div
//         style={{ margin: "25px", marginTop: "10px" }}
//         dangerouslySetInnerHTML={{ __html: articleVersion.content }}
//       />

//       <small style={{ marginLeft: "25px", color: "#666" }}>
//         Created: {new Date(articleVersion.createdAt).toLocaleString()}
//       </small>
//     </>
//   );
// }

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
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

export default function ArticleView() {
  const { wsId, articleId } = useParams();

  const [article, setArticle] = useState(null);
  const [version, setVersion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticle() {
      try {
        const res = await axios.get(
          `http://localhost:3000/workspaces/${wsId}/articles/${articleId}`
        );

        const a = res.data;
        const v = a.latestVersion; // ← ВОТ ЭТО ГЛАВНОЕ

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
    marginBottom: "20px",
    display: "inline-block",
    width: "120px",
    marginLeft: "25px"
  }}
>
  View Versions History
</Link>


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
