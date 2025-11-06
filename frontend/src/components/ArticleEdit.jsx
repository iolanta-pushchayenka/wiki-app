import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  max-width: 800px;
  margin-top: -600px;
  margin-left: 300px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: #333;
`;

const Input = styled.input`
  border: 2px solid #AFEEEE;
  border-radius: 5px;
  padding: 5px;
  width: 20%;
  font-size: 15px;
  margin-bottom: 20px;

  &:focus {
    outline: none;
    border-color: #AFEEEE;  
  }
`;

const Button = styled.button`
 background-color: #AFEEEE;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  color: black;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.2s ease;
  margin-top: 20px;

  &:hover {
    transform: scale(1.05);
    background-color: #AFEEEE;
  }
`;


const modules = {
  toolbar: [
    [{ 'font': [] }],
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'color': [] }, { 'background': [] }],
    ['link', 'image', 'video'],
    ['clean']
  ]
}

export default function ArticleEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);


const isContentEmpty = (html) => {
  const stripped = html.replace(/<(.|\n)*?>/g, "").trim(); // удаляем все HTML-теги
  return !stripped; // true если пусто
};

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/articles/${id}`);
        setTitle(res.data.title);
        setContent(res.data.content);
      } catch (err) {
        console.error(err);
        toast.error("Couldn't upload the article");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    // ✅ Проверка перед отправкой
  if (!title.trim() || isContentEmpty(content)) {
    toast.error("Title and content are required!");
    return;
  }

    try {
      await axios.put(`http://localhost:3000/articles/${id}`, {
        title,
        content,
      });
      toast.success("The article has been successfully updated!");
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      console.error(err);
      toast.error("Error saving changes");
    }
  };

  if (loading) {
    return (
      <p style={{ textAlign: "center", marginTop: "100px" }}>
       Uploading an article...
      </p>
    );
  }

  return (
    <>
      <Container>
        <Title>Edit Article</Title>
        <form onSubmit={handleUpdate} style={{ width: "100%" }}>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Введите заголовок"
          />

          <ReactQuill
            value={content}
            onChange={setContent}
            modules={modules}
            placeholder="Введите текст статьи..."
            style={{ height: "300px", marginBottom: "60px" }}
          />

          <Button type="submit">Save</Button>
        </form>
      </Container>

      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}
