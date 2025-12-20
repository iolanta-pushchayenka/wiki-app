import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import ArticleMenu from "./ArticleMenu";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Layout = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  background: #f8f9fa;
`;

const Sidebar = styled.div`
  width: 280px;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  padding: 20px;
  overflow-y: auto;
`;

const SidebarTitle = styled.h2`
  margin-bottom: 20px;
  font-size: 20px;
  color: #222;
`;

const WorkspaceItemWrapper = styled.div`
  position: relative;
  margin-bottom: 10px;
`;

const DeleteWorkspaceButton = styled.button`
  position: absolute;
  top: 4px;
  right: 8px;
  background: transparent;
  border: none;
  color: black;
  font-size: 14px;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: red;
  }
`;

const WorkspaceCreateButton = styled.button`
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background-color: #AFEEEE;
  border: 1px solid #8fdede;
  border-radius: 6px;
  color: #222;
  cursor: pointer;
  font-size: 15px;
  transition: 0.2s;

  &:hover {
    background-color: #9FE3E3;
  }
`;

const ContentCreateButton = styled.button`
  width: 28%;
  padding: 10px;
  display: block;
  margin-top: 10px;
  background-color: #AFEEEE;
  border: 1px solid #8fdede;
  border-radius: 6px;
  color: #222;
  cursor: pointer;
  font-size: 15px;
  transition: 0.2s;

  &:hover {
    background-color: #9FE3E3;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 40px;
`;

const SectionTitle = styled.h1`
  margin-bottom: 20px;
  color: #333;
`;

const ArticleItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border: 1px solid #dee2e6;
  padding: 14px;
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #f1f3f5;
  }
`;

const WorkspaceItem = styled.div`
  padding: 12px 14px;
  border-radius: 8px;
  background-color: ${({ active }) => (active ? "#AFEEEE" : "#f1f3f5")};
  color: #222;
  cursor: pointer;
  font-weight: 500;
  transition: 0.2s;
  border: 1px solid #ccc;

  &:hover {
    background-color: ${({ active }) => (active ? "#9FE3E3" : "#e9ecef")};
  }
`;

const WorkspaceInput = styled.input`
  width: 92%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  margin-bottom: 10px;
`;

const ContentInput = styled.input`
  width: 25%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  margin-bottom: 10px;
`;



export default function WorkspacesSidebar() {
  const { userId: currentUserId } = useAuth(); 
  const [workspaces, setWorkspaces] = useState([]);
  const [articles, setArticles] = useState([]);
  const [selectedWs, setSelectedWs] = useState(null);

  const [newWsName, setNewWsName] = useState("");
  const [newArticleTitle, setNewArticleTitle] = useState("");

  const navigate = useNavigate();

  const loadWorkspaces = async () => {
    try {
      const res = await api.get("/workspaces");
      setWorkspaces(res.data);
    } catch (err) {
      console.error("Ошибка загрузки воркспейсов:", err.response?.data || err.message);
    }
  };

  const loadArticles = async (id) => {
    try {
      const res = await api.get(`/workspaces/${id}/articles`);
      const articlesWithLatest = res.data.map(a => ({
        ...a,
        latestVersion: a.ArticleVersions?.[0] || null
      }));
      setArticles(articlesWithLatest);
    } catch (err) {
      console.error("Ошибка загрузки статей:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const createWorkspace = async () => {
    const trimmedName = newWsName.trim();
    if (!trimmedName) return alert("Введите название workspace");

    try {
      const res = await api.post("/workspaces", { name: trimmedName });
      setWorkspaces(prev => [...prev, res.data]);
      setNewWsName("");
    } catch (err) {
      console.error("Ошибка создания workspace:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Ошибка при создании workspace");
    }
  };

  const deleteWorkspace = async (wsId, wsOwnerId) => {
    if (Number(wsOwnerId) !== Number(currentUserId)) return;
    if (!window.confirm("Удалить этот workspace?")) return;

    try {
      await api.delete(`/workspaces/${wsId}`);
      setWorkspaces(prev => prev.filter(w => w.id !== wsId));
      if (selectedWs?.id === wsId) setSelectedWs(null);
    } catch (err) {
      console.error("Ошибка удаления workspace:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Ошибка при удалении workspace");
    }
  };

  const isOwnerWorkspace = selectedWs && Number(selectedWs.userId) === Number(currentUserId);

  return (
    <Layout>
      <Sidebar>
        <SidebarTitle>Workspaces</SidebarTitle>

        {workspaces.map(ws => (
          <WorkspaceItemWrapper key={ws.id}>
            <WorkspaceItem
              active={selectedWs?.id === ws.id}
              onClick={() => {
                setSelectedWs(ws);
                loadArticles(ws.id);
              }}
            >
              {ws.name}
            </WorkspaceItem>
            {Number(ws.userId) === Number(currentUserId) && (
              <DeleteWorkspaceButton onClick={() => deleteWorkspace(ws.id, ws.userId)}>✖</DeleteWorkspaceButton>
            )}
          </WorkspaceItemWrapper>
        ))}

        <WorkspaceInput
          placeholder="Название workspace..."
          value={newWsName}
          onChange={e => setNewWsName(e.target.value)}
        />
        <WorkspaceCreateButton onClick={createWorkspace}>
          + Создать Workspace
        </WorkspaceCreateButton>
      </Sidebar>

      <Content>
        {!selectedWs && <h2>Выберите workspace</h2>}

        {selectedWs && (
          <>
            <SectionTitle>{selectedWs.name}</SectionTitle>

            
            {isOwnerWorkspace && (
              <>
                <h3>Создать статью</h3>
                <ContentInput
                  placeholder="Название статьи..."
                  value={newArticleTitle}
                  onChange={e => setNewArticleTitle(e.target.value)}
                />
                <ContentCreateButton
                  onClick={() =>
                    navigate(
                      `/workspace/${selectedWs.id}/article/new?title=${encodeURIComponent(newArticleTitle)}`
                    )
                  }
                >
                  + Создать статью
                </ContentCreateButton>
              </>
            )}

            <h2 style={{ marginTop: "30px" }}>Статьи</h2>
            {articles.length === 0 && <p>В этом workspace пока нет статей</p>}

            {articles.map(a => (
              <ArticleItem
                key={a.id}
                onClick={() => navigate(`/workspace/${selectedWs.id}/article/${a.id}`)}
              >
                {a.latestVersion?.title || "Без заголовка"}

                <ArticleMenu
                  articleId={a.id}
                  wsId={selectedWs.id}
                  onDelete={(deletedId) => setArticles(prev => prev.filter(x => x.id !== deletedId))}
                  articleUserId={a.userId}
                />
              </ArticleItem>
            ))}
          </>
        )}
      </Content>
    </Layout>
  );
}
