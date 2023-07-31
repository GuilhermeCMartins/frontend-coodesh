import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "@/app/page";
import "@testing-library/jest-dom/extend-expect";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const pushMock = jest.fn();

describe("Login page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    const useRouter = jest.spyOn(require("next/navigation"), "useRouter");

    useRouter.mockImplementation(() => ({
      query: {},
      push: pushMock,
    }));
  });

  it("should render the login form", () => {
    render(<Login />);
    const nameInput = screen.getByLabelText("Nome");
    const passwordInput = screen.getByLabelText("Senha");
    const loginButton = screen.getByText("Entrar");

    expect(nameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  it("should login successfully", async () => {
    render(<Login />);
    const nameInput = screen.getByLabelText("Nome");
    const passwordInput = screen.getByLabelText("Senha");
    const loginButton = screen.getByText("Entrar");

    fireEvent.change(nameInput, { target: { value: "usuario123" } });
    fireEvent.change(passwordInput, { target: { value: "senha123" } });

    fireEvent.click(loginButton);
  });

  it("should fail to login with incorrect credentials", async () => {
    render(<Login />);
    const nameInput = screen.getByLabelText("Nome");
    const passwordInput = screen.getByLabelText("Senha");
    const loginButton = screen.getByText("Entrar");

    fireEvent.change(nameInput, { target: { value: "usuario_incorreto" } });
    fireEvent.change(passwordInput, { target: { value: "senha_incorreta" } });

    fireEvent.click(loginButton);

    expect(useRouter().push).not.toHaveBeenCalled();
  });
});
