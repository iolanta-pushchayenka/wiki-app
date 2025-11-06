import React, { useState, useRef } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styled from "styled-components";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


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

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  max-width: 800px;
  margin-top: -605px;
  margin-left: 250px;
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

const Title = styled.h2`
  margin-bottom: 20px;
  color: #333;
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

function ArticleForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toastId = useRef(null);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoading(true);


    const plainContent = content.replace(/<[^>]*>/g, '').trim();

    if (!title.trim() || !plainContent) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.error(
         "Please fill in the title and content of the article",
          { autoClose: 4000 }
        );
      }
      setIsSubmitting(false);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/articles", {
        title: title.trim(),
        content
      });

      toast.success("Your article has been successfully created! 🎊");
      setTitle("");
      setContent("");
      if (onCreated) onCreated(res.data);

    } catch (err) {
      console.error(err);
      toast.error("Error when saving");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };


  return (
    <>
      <FormWrapper>
        <Title>Create your article</Title>
        <form onSubmit={handleSubmit} >

          <Input type="text" placeholder="Enter your title..." name="title" value={title}
            onChange={(e) => setTitle(e.target.value)} />

          <ReactQuill value={content}
            onChange={setContent}
            modules={modules}
            style={{ height: "300px", marginBottom: "60px" }}
          />

          <Button type="submit" disabled={isSubmitting}>
            {loading ? "Saving..." : "Add Article"}
          </Button>
        </form>
      </FormWrapper>

      <ToastContainer
        position="top-center"
        autoClose={4000} 
      />
    </>
  );
}

export default ArticleForm;

