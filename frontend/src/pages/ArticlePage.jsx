import React, { useState, useEffect } from 'react';
import axios from "axios";
import ArticleView from '../components/ArticleView';
import Header from '../components/Header';
import { useParams } from "react-router-dom";
import ArticleList from '../components/ArticleList';

const ArticlePage = () => {
    const { id } = useParams();
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3000/articles")
            .then(res => setArticles(res.data));
    }, []);

    return (
        <div>
            <Header />
            <ArticleList articles={articles} setArticles={setArticles} />
            <ArticleView id={id} />
        </div>
    );
};

export default ArticlePage;