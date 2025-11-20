import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

const List = styled.ul`
display: flex;
flex-direction: column;   
  gap: 20px;  
`;


export default function ArticleList ({onSelect}) {
const[articles, setArticles] = useState([]);

useEffect(() => {
    axios.get("http://localhost:3000/articles")
      .then(res => setArticles(res.data))
      .catch(err => console.error("Ошибка при загрузке:", err));
  }, []);


return (
  <div>
    <h2>List of articles: </h2>
    {articles.length === 0 && <p>You don't have any articles</p>}
  <List>
    {articles.map (article => 
    <li key = {article.id}>
    <button onClick={ () => onSelect(article.id)}>
      {article.title}
    </button>
  </li>
  )}
</List>
  </div>
    )}