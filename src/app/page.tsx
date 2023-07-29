"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Container, Typography, TextField, Button, Grid } from "@mui/material";
import { toast } from "react-toastify";

export default function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

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

    try {
      const response = await axios.post(
        "http://localhost:4000/api/auth/login",
        {
          name,
          password,
        }
      );
      console.log("Login successful!", response.data);
      toast.success("Login successful!");
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Usuário ou senha incorretos.");
    }
  };

  return (
    <Container
      maxWidth="sm"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        padding: "2rem",
        borderRadius: "8px",
      }}
    >
      <Typography variant="h3" gutterBottom style={{ marginBottom: "1rem" }}>
        Login
      </Typography>
      {error && <div className="error-message">{error}</div>}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome"
            error={nameError}
            helperText={nameError && "Por favor, preencha o campo nome."}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            type="password"
            label="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            error={passwordError}
            helperText={passwordError && "Por favor, preencha o campo senha."}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Login
          </Button>
        </Grid>
      </Grid>
      <div style={{ marginTop: "1rem" }}>
        <Typography variant="body1" component="span">
          Não tem uma conta?&nbsp;
        </Typography>
        <Link href="/register">Registre-se</Link>
      </div>
    </Container>
  );
}
