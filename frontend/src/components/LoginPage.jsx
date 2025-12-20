import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 

const Container = styled.div`
  max-width: 400px;
  margin: 100px auto;
  padding: 30px;
  border-radius: 10px;
  background: #f0fafa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 25px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 2px solid #afeeee;
  border-radius: 5px;
  font-size: 15px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background: #afeeee;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background: #9be3e3;
  }
`;

const Error = styled.p`
  color: red;
  text-align: center;
  margin-bottom: 10px;
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 15px;
`;

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth(); 

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post("http://localhost:3000/auth/login", {
                email,
                password,
            });

            const { token } = res.data;

            login(token);              
            navigate("/", { replace: true }); 

        } catch (err) {
            setError("Invalid email or password");
        }
    };

    return (
        <Container>
            <Title>Login</Title>
            {error && <Error>{error}</Error>}
            <form onSubmit={handleSubmit}>
                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button type="submit">Login</Button>
            </form>

            <Footer>
                No account? <Link to="/register">Register</Link>
            </Footer>
        </Container>
    );
}
