import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const HeaderWrapper = styled.header`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-sizing: border-box;
  background-color: white;
`;

const Title = styled.h1`
  font-size: 25px;
  margin: 0;
  color: black;
`;

export const SearchInput = styled.input`
  padding: 8px 12px;
  width: 200px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 14px;
  margin-right: 20px;

  &:focus {
    outline: none;
    border-color: #888;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const ManagementButton = styled.button`
  padding: 6px 10px;
  border: 1px solid #8fdede;
  border-radius: 4px;
  text-decoration: none;
  color: black;
  font-size: 14px;
  margin-left: 25px;
  background-color: #AFEEEE;

  display: inline-block;
  text-align: center;

  &:hover {
    background-color:  #9be3e3;
  }
`;


const LogoutButton = styled.button`
  padding: 6px 10px;
  border: 1px solid #8fdede;
  border-radius: 4px;
  text-decoration: none;
  color: black;
  font-size: 14px;
  margin-left: 25px;
  background-color: #AFEEEE;

  display: inline-block;
  text-align: center;

  &:hover {
    background-color: #9be3e3;
  }
`;


const UserEmail = styled.span`
  font-size: 16px;
  color: black;
`;


export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <HeaderWrapper>
      <Title>📝 My Wiki</Title>

      <SearchInput type="text" placeholder="Search..." />

      <NavLinks>
        {user?.role === "admin" && (
          <ManagementButton onClick={() => navigate("/users")}>
            User Management
          </ManagementButton>
        )}

        {user?.email && (
          <UserEmail>{user.email}</UserEmail>
        )}

        <LogoutButton onClick={logout}>
          Logout
        </LogoutButton>
      </NavLinks>
    </HeaderWrapper>
  );
}

