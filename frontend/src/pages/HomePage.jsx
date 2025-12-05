import React, { useState, useEffect } from 'react';
import WorkspacesSidebar from "../components/WorkspacesSidebar";
import Header from "../components/Header";
import axios from "axios";
import styled from "styled-components"
import { useNavigate } from "react-router-dom";

const Title = styled.h2`
font-size: 20px;
`;

const Wrapper = styled.div`
margin-top: -450px;
display: flex;
align-items: center; 
justify-content: center;
flex-direction: column; 
gap: 20px;
`;

export const NewArticleButton = styled.div`
  width: 15%;
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

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3000/articles")
      .then(res => setArticles(res.data))
      .catch(console.error);
  }, []);

  return (
    <>
      <Header />
      <WorkspacesSidebar />
    </>
  );
};

export default HomePage;