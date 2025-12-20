import { useEffect, useState } from "react";
import api from "../api/axios";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";

const Container = styled.div`
  margin-top: 30px;
  max-width: 600px;
`;

const Title = styled.h3`
  font-size: 22px;
  margin-bottom: 15px;
`;

const CommentBox = styled.div`
  border: 1px solid #e3e3e3;
  padding: 12px 15px;
  border-radius: 8px;
  margin-bottom: 12px;
  background: #fafafa;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  min-height: 60px;
  border-radius: 6px;
  border: 1px solid #ccc;
  resize: vertical;
  font-size: 14px;
`;

const Button = styled.button`
  padding: 8px 14px;
  margin-top: 8px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: #4a90e2;
  color: white;
  font-size: 14px;

  &:disabled {
    background: #9fc5f8;
  }

  & + button {
    margin-left: 8px;
    background: #aaa;
  }
`;

const CommentText = styled.p`
  margin: 0 0 6px 0;
  font-size: 15px;
`;

const DateText = styled.small`
  color: #777;
`;

export default function CommentsList({ articleId }) {
    const { userId: currentUserId } = useAuth();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");

    // Загрузка комментариев
    const loadComments = () => {
        api
            .get(`/articles/${articleId}/comments`)
            .then(res => {
                setComments(res.data || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        if (articleId) loadComments();
    }, [articleId]);

    // Добавление нового комментария
    const handleSubmit = async e => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            const res = await api.post(`/articles/${articleId}/comments`, { content: newComment });
            setComments([res.data, ...comments]);
            setNewComment("");
        } finally {
            setSubmitting(false);
        }
    };

    // Удаление комментария
    const handleDelete = async id => {
        if (!window.confirm("Удалить комментарий?")) return;
        try {
            await api.delete(`/articles/comment/${id}`);
            setComments(comments.filter(c => c.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    // Редактирование комментария
    const handleUpdate = async id => {
        try {
            const res = await api.put(`/articles/comment/${id}`, { content: editText });
            setComments(comments.map(c => (c.id === id ? res.data : c)));
            setEditingId(null);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <p>Loading comments...</p>;

    return (
        <Container>
            <Title>Комментарии</Title>

            {/* Форма добавления комментария */}
            <form onSubmit={handleSubmit}>
                <TextArea
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Напиши комментарий..."
                />
                <Button disabled={submitting}>{submitting ? "..." : "Добавить"}</Button>
            </form>

            {/* Список комментариев */}
            {comments.map(c => {
                const isAuthor = currentUserId === c.userId; // проверка автора комментария

                return (
                    <CommentBox key={c.id}>
                        {editingId === c.id ? (
                            <>
                                <TextArea value={editText} onChange={e => setEditText(e.target.value)} />
                                <Button onClick={() => handleUpdate(c.id)}>Сохранить</Button>
                                <Button onClick={() => setEditingId(null)}>Отмена</Button>
                            </>
                        ) : (
                            <>
                                <CommentText>{c.content}</CommentText>
                                <DateText>{new Date(c.createdAt).toLocaleString()}</DateText>
                                <br />
                                <br />
                                {isAuthor && (
                                    <>
                                        <Button onClick={() => { setEditingId(c.id); setEditText(c.content); }}>Редактировать</Button>
                                        <Button onClick={() => handleDelete(c.id)}>Удалить</Button>
                                    </>
                                )}
                            </>
                        )}
                    </CommentBox>
                );
            })}
        </Container>
    );
}
