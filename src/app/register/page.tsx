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
import { useRouter } from "next/navigation";
import SectionLogin from "../components/loginComponents/mainContainer";

export default function Register() {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
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
      const response = await axios.post(
        "http://localhost:4000/api/auth/register",
        {
          name,
          password,
        }
      );
      console.log("Register successful!", response.data);
      toast.success("Register successful!");
      router.push("/login");
    } catch (error) {
      console.error("Error during register:", error);
      toast.error("Usuário já existente.");
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
          Register
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
            onClick={handleRegister}
          >
            {isLoading ? (
              <CircularProgress color="inherit" size={24} />
            ) : (
              "Register"
            )}
          </Button>
        </Container>

        <div style={{ marginTop: "1rem" }}>
          <Typography variant="body1" component="span">
            Já possui uma conta?&nbsp;
          </Typography>
          <Link href="/" style={{ textDecoration: "none", color: "gray" }}>
            Faça o login
          </Link>
        </div>
      </Container>
    </SectionLogin>
  );
}
