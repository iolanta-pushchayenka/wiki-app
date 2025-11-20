import React, { useState, useEffect } from 'react';
import axios from "axios";
import Header from "../components/Header";
import ArticleList from '../components/ArticleList';
import ArticleEdit from '../components/ArticleEdit';

const EditPage = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3000/articles")
            .then(res => setArticles(res.data));
    }, []);


    return (
        <>
            <Header />
            <ArticleList articles={articles} setArticles={setArticles} />
            <ArticleEdit />
        </>
    );
};

export default EditPage; 