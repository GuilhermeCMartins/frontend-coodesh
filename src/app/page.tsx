"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");
      const response = await axios.post(
        "http://localhost:4000/api/auth/login",
        {
          name,
          password,
        }
      );
      console.log("Login successful!", response.data);
    } catch (error) {
      console.error("Error during login:", error);
      setError("Usuário ou senha incorretos.");
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="form-group">
        <label>Nome:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Digite seu nome"
        />
      </div>
      <div className="form-group">
        <label>Senha:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Digite sua senha"
        />
      </div>
      <button onClick={handleLogin}>Login</button>
      <div className="register-link">
        <span>Não tem uma conta? </span>
        <Link href="/register">Registre-se</Link>
      </div>
    </div>
  );
}
