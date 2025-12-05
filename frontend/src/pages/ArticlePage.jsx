import React, { useState, useEffect } from 'react';
import axios from "axios";
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



//   const { id } = useParams();
//   const [article, setArticle] = useState(null);

//   useEffect(() => {
//     axios.get(`http://localhost:3000/articles/${id}`)
//       .then(res => setArticle(res.data))
//       .catch(err => console.error(err));
//   }, [id]);

//   const { wsId, articleId } = useParams();


// useEffect(() => {
//   axios.get(`http://localhost:3000/workspaces/${wsId}/articles/${articleId}`)
//     .then(res => setArticle(res.data))
//     .catch(err => console.error(err));
// }, [wsId, articleId]);

const ArticlePage = () => {

  const { wsId, articleId } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/workspaces/${wsId}/articles/${articleId}`)
      .then(res => setArticle(res.data))
      .catch(err => console.error(err));
  }, [wsId, articleId]);

  if (!article) return <p>Loading...</p>;

  const attachments = article.attachments || [];

  return (
    <>
      <NotificationToast />
      <Header />
      <Box>
        <ArticleView article={article} />

        <AttachmentList
          articleId={articleId}
          attachments={attachments}
          readonly={true}
          onDelete={() => {}}
        />

        <CommentsAccordion
          articleId={article.id}
          comments={article.comments || []}
        />
      </Box>
    </>
  );
};

export default ArticlePage;
