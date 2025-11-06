import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import styled from "styled-components";

  const Article = styled.div`
margin-top: -600px;
margin-left: 280px;
width: 950px;
`;


function ArticleView() {
  const [article, setArticle] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:3000/articles/${id}`)
      .then(res => setArticle(res.data))
      .catch(() => setArticle(null));
  }, [id]);

  if (article === null) return <p>Loading...</p>;
  if (!article) return <p>Article not found</p>;


  return (
    <Article>
      <h2>{article.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: article.content }} />
      <small>Created: {new Date(article.createdAt).toLocaleString()}</small>
      <ToastContainer position="top-center" autoClose={4000} />
    </Article>
  );
}

export default ArticleView;