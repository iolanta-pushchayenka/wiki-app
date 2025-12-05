import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export const Wrapper = styled.div`
  width: 250px;
  background-color: #f8f9fa;
  border-right: 1px solid #ddd;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
  scrollbar-width: none;
  position: relative;
`;

export const Title = styled.h2`
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #333;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;


export const WorkspaceButton = styled.div`
  background-color: ${({ active }) => (active ? "#e9ecef" : "#fff")};
  padding: 10px 15px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e9ecef;
  }
`;

export const NewWorkspaceButton = styled.div`
  background-color: #AFEEEE;
  padding: 10px 15px;
  border-radius: 6px;
  margin-top: 15px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  cursor: pointer;

  &:hover {
    background-color: #e0f5f5;
  }
`;

export const TitleRow = styled.div`
  font-weight: 500;
  font-size: 16px;
  color: #333;
`;

export default function WorkspacesSidebar() {
  const [workspaces, setWorkspaces] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const currentWorkspaceId = location.pathname.startsWith("/workspaces/")
    ? location.pathname.split("/")[2]
    : null;

  useEffect(() => {
    axios.get("/api/workspaces")
      .then(res => setWorkspaces(res.data))
      .catch(err => console.error("Failed to load workspaces:", err));
  }, []);

  return (
    <Wrapper>
      <Title>Workspaces</Title>

      <List>
        {workspaces.length === 0 && <p>You don't have any workspaces</p>}

        {workspaces.map(ws => (
          <WorkspaceButton
            key={ws.id}
            active={String(ws.id) === String(currentWorkspaceId)}
            onClick={() => navigate(`/workspaces/${ws.id}`)}
          >
            <TitleRow>{ws.name}</TitleRow>
          </WorkspaceButton>
        ))}

        <NewWorkspaceButton onClick={() => navigate("/workspaces/create")}>
          + Create Workspace
        </NewWorkspaceButton>
      </List>
    </Wrapper>
  );
}
