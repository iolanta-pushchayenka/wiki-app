import React, { useState, useEffect } from 'react';
import axios from "axios";
import Header from "../components/Header";
import ArticleList from '../components/ArticleList';
import ArticleEdit from '../components/ArticleEdit';
import { useParams } from 'react-router-dom';

const EditPage = () => {
    const [article, setArticle] = useState(null);
    const [articles, setArticles] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        axios.get("http://localhost:3000/articles")
            .then(res => setArticles(res.data))
            .catch(console.error);
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:3000/articles/${id}`)
            .then(res => setArticle(res.data))
            .catch(err => console.error(err));
    }, [id]);

    if (!article) return <p>Loading...</p>;

    return (
        <>
            <Header />
            <ArticleList
                articles={articles}
                setArticles={setArticles}
            />
            <ArticleEdit article={article} setArticle={setArticle} />
        </>
    );
};

export default EditPage;
