import React, { useState, useEffect } from 'react';
import api from "../api/axios";
import ArticleView from '../components/ArticleView';
import Header from '../components/Header';
import { useParams } from "react-router-dom";
import styled from "styled-components";
import AttachmentList from '../components/AttachmentList';
import NotificationToast from '../components/NotificationToast';
import CommentsAccordion from '../components/CommentsAccordion';

const Box = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ArticlePage = () => {
  const { wsId, articleId } = useParams();
  const [article, setArticle] = useState(null);

useEffect(() => {
  api.get(`/articles/${articleId}`)
    .then(res => setArticle(res.data))
    .catch(err => console.error(err));
}, [articleId]);


  if (!article) return <p>Loading...</p>;

  const latestVersion = article.latestVersion;
  if (!latestVersion) return <p>No versions found</p>;

  const attachments = latestVersion.attachments || [];

  return (
    <>
      <NotificationToast />
      <Header />

      <Box>
        <ArticleView articleVersion={latestVersion} />

        <AttachmentList
          articleId={articleId}
          attachments={attachments}
          readonly={true}
          onDelete={() => {}}
        />

        <CommentsAccordion
          articleId={article.id}
          comments={article.Comments || []}
        />
      </Box>
    </>
  );
};

export default ArticlePage;
