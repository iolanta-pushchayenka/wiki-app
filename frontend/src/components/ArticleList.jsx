import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import ArticleMenu from "../components/ArticleMenu";


export const Wrapper = styled.div`
  width: 250px;
  background-color: #f8f9fa; 
  border-right: 1px solid #ddd;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
  scrollbar-width: none;
`;

export const Title = styled.h2`
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #333;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: absolute;
  z-index: 9999;
  width: 20%;
`;

export const ArticleButton = styled.div`
  width: 75%;
background-color: #fff;
  padding: 10px 15px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e9ecef;
  }
`;


export const NewArticleButton = styled.div`
  width: 75%;
background-color: #AFEEEE;
  padding: 10px 15px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e9ecef;
  }
`;

export const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    font-weight: 500;
    font-size: 16px;
    color: #333;
  }
`;

export const CreatedAt = styled.div`
  font-size: 12px;
  color: #888;
  margin-top: 5px;
`;

export default function ArticleList({ articles, setArticles }) {
  const navigate = useNavigate();


  const handleArticleDelete = (deletedId) => {
    setArticles(prev => prev.filter(article => article.id !== deletedId));
  };


  return (
    <Wrapper>
      <Title>My articles</Title>
      {articles.length === 0 && <p>You don't have any articles</p>}
      <List>
        {articles.map(article =>
          <ArticleButton key={article.id} onClick={() => navigate(`/article/${article.id}`)}>
            <TitleRow>
              <span>{article.title}</span>
              <ArticleMenu articleId={article.id} onDelete={handleArticleDelete} />
            </TitleRow>
            <CreatedAt>{new Date(article.createdAt).toLocaleDateString()}</CreatedAt>
          </ArticleButton>
        )}

        <NewArticleButton onClick={() => navigate('/create')}> Create New Article  +</NewArticleButton>
      </List>


    </Wrapper>

  )
}