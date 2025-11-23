import React, { useState, useEffect } from 'react';
import axios from "axios";
import ArticleView from '../components/ArticleView';
import Header from '../components/Header';
import { useParams } from "react-router-dom";
import styled from "styled-components";
import AttachmentList from '../components/AttachmentList';
import NotificationToast from '../components/NotificationToast';

const Box = styled.div`
display: flex;
flex-direction: column;
gap: 20px;
`;


const ArticlePage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/articles/${id}`)
      .then(res => setArticle(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!article) return <p>Loading...</p>;

  const attachments = article.attachments || [];


  return (
    <>
      <NotificationToast />
      <Header />
      <Box>
        <ArticleView article={article} />

        <AttachmentList
          articleId={id}
          attachments={attachments}
          readonly={true}
          onDelete={() => { }}
        />
      </Box>
    </>
  );
};

export default ArticlePage;
