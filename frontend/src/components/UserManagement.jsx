import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import styled from "styled-components";
import { Link } from "react-router-dom";


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

export default function UserManagement() {
  const { token, user } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get("http://localhost:3000/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(res.data);
      } catch (err) {
        setError("Access denied or failed to load users");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [token]);

  async function handleRoleChange(userId, role) {
    try {
      setUpdatingId(userId);

      const res = await axios.patch(
        `http://localhost:3000/users/${userId}/role`,
        { role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers((users) =>
        users.map((u) => (u.id === userId ? res.data : u))
      );
    } catch (err) {
      alert("Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <BackButton to="/"> ← Back to workspaces </BackButton>
      <h2>User Management</h2>

      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Registered</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.email}</td>

              <td>
                <select
                  value={u.role}
                  disabled={
                    u.id === user.userId || updatingId === u.id
                  }
                  onChange={(e) =>
                    handleRoleChange(u.id, e.target.value)
                  }
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </td>

              <td>
                {new Date(u.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
