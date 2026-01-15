import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Header from "../components/Header";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const Wrapper = styled.div`
  max-width: 900px;
  margin: 30px auto;
  padding: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }

  th {
    text-align: left;
  }
`;
const VersionButton = styled(Link)`
padding: 6px 12px; 
background: #afeeee;
 border-radius: 4px; 
 text-decoration: none; 
 color: black;
 
 &:hover { background: #9be3e3; } `
    ;


const BackButton = styled(Link)`
      padding: 6px 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      text-decoration: none;
      color: black;
      font-size: 14px;
      width: 10%;
      margin-left: 25px;
    
      &:hover {
        background-color: #f0f0f0;
      }
    `;

export default function VersionsListPage() {
    const { wsId, articleId } = useParams();
    const [versions, setVersions] = useState([]);
    const navigate = useNavigate();
    const { token } = useAuth();

    useEffect(() => {
        axios.get(
            `http://localhost:3000/articles/${articleId}/versions`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
            .then((res) => setVersions(res.data))
            .catch((err) => console.error(err));
    }, [articleId, token]);


    return (
        <>
            <Header />

            <BackButton to={`/workspace/${wsId}/article/${articleId}`}>
                ← Back to article
            </BackButton>
            <Wrapper>
                <h2>Versions History</h2>

                <Table>
                    <thead>
                        <tr>
                            <th>Version</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {versions.map((v) => (
                            <tr key={v.id}>
                                <td>{v.versionNumber}</td>
                                <td>{new Date(v.createdAt).toLocaleString()}</td>
                                <td>
                                    <VersionButton
                                        to={`/workspaces/${wsId}/articles/${articleId}/versions/${v.versionNumber}`}
                                    >
                                        View
                                    </VersionButton>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Wrapper>
        </>
    )
}
