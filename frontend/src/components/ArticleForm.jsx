import React, { useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styled from "styled-components";

const Button = styled.button`
background-color: #FA8072;
  align-self: flex-start;
border: none;
border-radius: 5px;
padding: 5px 5px;
`;


const Input = styled.input`
  align-self: flex-start;
 border-color: #FA8072;
 border-radius: 5px;
padding: 5px 5px;
  &:focus {
    outline: none;           
    border-color: #FA8072; 
    border-radius: 5px;
  }
`;

const Form = styled.form`
display: flex;
flex-direction: column;   
  gap: 20px;  
  width: 1000px;
    align-self: flex-start;
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


  const handleSubmit = async (e) => {
    e.preventDefault()
    ;


    try {
      const res = await axios.post("http://localhost:3000/articles", {
        title,
        content
      });
      alert("Ваша статья успешно создана! 🎊");
      setTitle("");
      setContent("");
      onCreated(res.data);
    } catch (err) {
      alert("Ошибка при сохранении &#128546;");
      console.error(err);
    }
  };


return (

<Form onSubmit={handleSubmit}>

<Input type="text" placeholder="Enter your title..."  name="title" value={title}
onChange={(e) => setTitle(e.target.value)} required></Input>

<ReactQuill value={content} onChange={setContent} modules={modules}/>

<Button type="submit">Add article</Button>
</Form>

    );
  }

export default ArticleForm;

