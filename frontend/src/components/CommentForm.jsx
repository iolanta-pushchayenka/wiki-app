import React, { useState } from "react";
import api from "../api/axios";
import styled from "styled-components";

const Box = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 70px;
  padding: 10px;
`;

const Button = styled.button`
  padding: 8px 14px;
  background: #007bff;
  border: none;
  color: white;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #0056d2;
  }
`;

const CommentForm = ({ articleId }) => {
    const [text, setText] = useState("");

    const handleSubmit = async () => {
        if (!text.trim()) return;

        await api.post("/comments", {
            articleId,
            text,
        });

        setText("");
        window.dispatchEvent(new Event("commentsUpdated")); 
    };

    return (
        <Box>
            <label>Добавить комментарий:</label>
            <TextArea value={text} onChange={(e) => setText(e.target.value)} />
            <Button onClick={handleSubmit}>Добавить комментарий</Button>
        </Box>
    );
};

export default CommentForm;
