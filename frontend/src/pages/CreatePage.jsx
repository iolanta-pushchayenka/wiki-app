import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import Header from "../components/Header";
import ArticleList from '../components/ArticleList';
import ArticleForm from '../components/ArticleForm';
import AttachmentList from '../components/AttachmentList';

const CreatePage = () => {
    const [articles, setArticles] = useState([]);
    const [article, setArticle] = useState(null);
    const { wsId, articleId } = useParams();

    useEffect(() => {
        if (!articleId) return;

        axios.get(`http://localhost:3000/articles/${articleId}`)
            .then(res => {
                
                setArticle(res.data);

                setArticles(Array.isArray(res.data) ? res.data : [res.data]);
            })
            .catch(err => console.error("Ошибка загрузки статьи:", err));
    }, [articleId]);

    const handleArticleCreated = (newArticle) => {
        setArticles(prev => [...prev, newArticle]);
    };

    const attachments = article?.attachments || [];

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px',
                maxWidth: '1200px',
                margin: '0 auto',
                gap: '20px',
            }}
        >
            <Header />

            <div style={{ width: '100%' }}>
                <ArticleList articles={articles} setArticles={setArticles} />
            </div>

            <div style={{ width: '100%' }}>
                <ArticleForm onCreated={handleArticleCreated} />
            </div>

            <div style={{ width: '100%' }}>
                <AttachmentList
                    articleId={articleId}
                    attachments={attachments}
                    readonly={true}
                    onDelete={() => {}}
                />
            </div>
        </div>
    );
};

export default CreatePage;
