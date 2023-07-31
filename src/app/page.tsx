"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import SectionLogin from "./components/loginComponents/mainContainer";
import { useRouter } from "next/navigation";
import useAuthentication from "./hooks/useAutentication";

export default function Login() {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const router = useRouter();
  const { login } = useAuthentication();

  const handleLogin = async () => {
    setNameError(false);
    setPasswordError(false);

    if (!name) {
      setNameError(true);
      return;
    }

    if (!password) {
      setPasswordError(true);
      return;
    }

    setIsLoading(true);

    try {
      const loggedUser = await login(name, password);
      toast.success("Login bem sucedido!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Usuário ou senha incorretos.");
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1300);
    }
  };

  return (
    <SectionLogin>
      <Container
        maxWidth="sm"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          padding: "2rem",
          borderRadius: "8px",
          backgroundColor: "white",
          minHeight: "40vh",
          borderTop: "4px solid #2196f3",
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          style={{
            marginBottom: "1rem",
            textTransform: "uppercase",
            fontWeight: "700",
          }}
        >
          Login
        </Typography>
        {error && <div className="error-message">{error}</div>}
        <Container maxWidth="xs">
          <TextField
            fullWidth
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome"
            error={nameError}
            helperText={nameError && "Por favor, preencha o campo nome."}
            style={{ marginBottom: "1rem" }}
          />
          <TextField
            fullWidth
            type="password"
            label="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            error={passwordError}
            helperText={passwordError && "Por favor, preencha o campo senha."}
            style={{ marginBottom: "1rem" }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
          >
            {isLoading ? (
              <CircularProgress color="inherit" size={24} />
            ) : (
              "Entrar"
            )}
          </Button>
        </Container>

        <div style={{ marginTop: "1rem" }}>
          <Typography variant="body1" component="span">
            Não tem uma conta?&nbsp;
          </Typography>
          <Link
            href="/register"
            style={{ textDecoration: "none", color: "gray" }}
          >
            Registre-se
          </Link>
        </div>
      </Container>
    </SectionLogin>
  );
}
