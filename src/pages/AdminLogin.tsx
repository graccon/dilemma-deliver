import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { textStyles } from "../styles/textStyles";
import styled from "styled-components";
import colors from '../styles/colors';

const AdminLogin = () => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    const ADMIN_ID = import.meta.env.VITE_ADMIN_ID;
    const ADMIN_PW = import.meta.env.VITE_ADMIN_PW;

    if (id === ADMIN_ID && pw === ADMIN_PW) {
      localStorage.setItem("isAdmin", "true");
      navigate("/admin");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <Container>
      <LoginBox>
        <h2>Admin Login</h2>
        <Input
          type="text"
          placeholder="Admin ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
        <Button onClick={handleLogin}>Login</Button>
      </LoginBox>
    </Container>
  );
};

export default AdminLogin;

const Container = styled.div`
  ${textStyles.secondH1()};
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${colors.gray100}
`;

const LoginBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem 3rem;
`;

const Input = styled.input`
  ${textStyles.h4()};
  padding: 0.6rem;
  width: 300px;
  border-radius: 0.5rem;
  border: 1px solid ${colors.gray400};
`;

const Button = styled.button`
  ${textStyles.buttonLabel()};
  padding: 0.6rem;
  background-color: ${colors.black};
  color: ${colors.white};
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
`;
