
function ArticleView({ article }) {
  if (!article) return <p>Loading...</p>;

  return (
    <>
      <h2>{article.title}</h2>

      <div dangerouslySetInnerHTML={{ __html: article.content }} />

      <small>
        Created: {new Date(article.createdAt).toLocaleString()}
      </small>
  </>
  );
}

export default ArticleView;
