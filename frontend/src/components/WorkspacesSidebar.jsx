import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import ArticleMenu from "./ArticleMenu";


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
  background: #4dabf7;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 15px;
  transition: 0.2s;

  &:hover {
    background-color: #339af0;
  }
`;

const ContentCreateButton = styled.button`
  display: block;
  width: 28%;
  padding: 10px;
  margin-top: 10px;
  background: #4dabf7;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 15px;
  transition: 0.2s;

  &:hover {
    background-color: #339af0;
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
  display: flex;           // делаем flex-контейнер
  justify-content: space-between; // название слева, меню справа
  align-items: center;     // выравнивание по вертикали
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
  background: ${({ active }) => (active ? "#4dabf7" : "#f1f3f5")};
  color: ${({ active }) => (active ? "#fff" : "#222")};
  cursor: pointer;
  font-weight: 500;
  transition: 0.2s;

  &:hover {
    background: ${({ active }) => (active ? "#339af0" : "#e9ecef")};
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

// -----------------------------
export default function WorkspacesSidebar() {
  const [workspaces, setWorkspaces] = useState([]);
  const [articles, setArticles] = useState([]);
  const [selectedWs, setSelectedWs] = useState(null);

  const [newWsName, setNewWsName] = useState("");
  const [newArticleTitle, setNewArticleTitle] = useState("");

  const navigate = useNavigate();

  // Load Workspaces
  async function loadWorkspaces() {
    const res = await fetch("http://localhost:3000/workspaces");
    const data = await res.json();
    setWorkspaces(data);
  }

  // Load Articles
  async function loadArticles(id) {
    const res = await fetch(`http://localhost:3000/workspaces/${id}/articles`);
    const data = await res.json();
    setArticles(data);
  }

  useEffect(() => {
    loadWorkspaces();
  }, []);

  // Create Workspace
  async function createWorkspace() {
    if (!newWsName.trim()) return;

    const res = await fetch("http://localhost:3000/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newWsName })
    });

    if (!res.ok) return alert("Ошибка при создании workspace");

    const ws = await res.json();
    setWorkspaces(prev => [...prev, ws]);

    setNewWsName("");
  }

  // Delete Workspace
  async function deleteWorkspace(wsId) {
    if (!window.confirm("Удалить этот workspace?")) return;

    try {
      await fetch(`http://localhost:3000/workspaces/${wsId}`, { method: "DELETE" });
      setWorkspaces(prev => prev.filter(w => w.id !== wsId));
      if (selectedWs?.id === wsId) setSelectedWs(null);
    } catch (err) {
      console.error(err);
      alert("Ошибка при удалении workspace");
    }
  }

  // Create Article
  async function createArticle() {
    if (!selectedWs) return;
    if (!newArticleTitle.trim()) return;

    const res = await fetch(
      `http://localhost:3000/workspaces/${selectedWs.id}/articles`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newArticleTitle,
          content: ""
        })
      }
    );

    if (!res.ok) return alert("Ошибка при создании статьи");

    const article = await res.json();
    setArticles(prev => [...prev, article]);

    setNewArticleTitle("");
  }

  return (
    <Layout>
      {/* SIDEBAR */}
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
            <DeleteWorkspaceButton onClick={() => deleteWorkspace(ws.id)}>✖</DeleteWorkspaceButton>
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

      {/* CONTENT */}
      <Content>
        {!selectedWs && <h2>Выберите workspace</h2>}

        {selectedWs && (
          <>
            <SectionTitle>{selectedWs.name}</SectionTitle>

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


            <h2 style={{ marginTop: "30px" }}>Статьи</h2>

            {articles.length === 0 && <p>В этом workspace пока нет статей</p>}

            {articles.map(a => (
              <ArticleItem
                key={a.id}
                onClick={() => navigate(`/workspace/${selectedWs.id}/article/${a.id}`)}
              >
                {a.title}

                <ArticleMenu
                  articleId={a.id}
                  wsId={selectedWs.id}
                  onDelete={(deletedId) => setArticles(prev => prev.filter(x => x.id !== deletedId))}
                />

              </ArticleItem>
            ))}
          </>
        )}
      </Content>
    </Layout>
  );
}
