import React, { useState, useEffect } from 'react';
import axios from "axios";
import Header from "../components/Header";
import ArticleList from '../components/ArticleList';
import ArticleForm from '../components/ArticleForm';

const CreatePage = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3000/articles")
            .then(res => setArticles(res.data));
    }, []);

    const handleArticleCreated = (newArticle) => {
        setArticles(prev => [...prev, newArticle]);
    };

    return (
        <>
            <Header />
            <ArticleList articles={articles} setArticles={setArticles} />
            <ArticleForm onCreated={handleArticleCreated} />
        </>
    );
};

export default CreatePage;

