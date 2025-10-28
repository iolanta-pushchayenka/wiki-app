import React, { useEffect, useState } from "react";
import axios from "axios";


function ArticleView({ id, onBack }) {
 const [article, setArticle] = useState(null);


  useEffect(() => {
    axios.get(`http://localhost:3000/articles/${id}`)
      .then(res => setArticle(res.data))
      .catch(() => setArticle(null));
  }, [id]);

  if (!article) return <p>Article not found</p>;

  return (
    <div>
      <button onClick={(onBack)}>&#8592; Back</button>
      <h2>{article.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: article.content }} />
      <small>Создано: {new Date(article.createdAt).toLocaleString()}</small>
    </div>
  );
}

export default ArticleView;