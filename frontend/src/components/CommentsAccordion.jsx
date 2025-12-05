import React, { useState } from "react";
import styled from "styled-components";
import CommentForm from "./CommentForm";
import CommentsList from "./CommentsList";

const Wrapper = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 12px;
`;

const Header = styled.div`
  font-weight: bold;
  cursor: pointer;
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Content = styled.div`
  margin-top: 15px;
`;

const CommentsAccordion = ({ articleId, comments }) => {
    const [open, setOpen] = useState(false);

    return (
        <Wrapper>
            <Header onClick={() => setOpen(!open)}>
                <span>Комментарии</span>
                <span>{open ? "▲" : "▼"}</span>
            </Header>

            {open && (
                <Content>
                    <CommentsList articleId={articleId} />
                </Content>
            )}
        </Wrapper>
    );
};

export default CommentsAccordion;
