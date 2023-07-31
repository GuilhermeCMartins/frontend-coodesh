import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import useAuthentication from "@/app/hooks/useAutentication";
import Register from "@/app/register/page";
import { useRouter } from "next/navigation";

jest.mock("@/app/hooks/useAutentication");

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const mockRegister = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  (useAuthentication as any).mockReturnValue({
    register: mockRegister,
  });
});

test("should register successfully", async () => {
  render(<Register />);

  fireEvent.change(screen.getByLabelText("Nome"), {
    target: { value: "John Doe" },
  });
  fireEvent.change(screen.getByLabelText("Senha"), {
    target: { value: "password123" },
  });

  (useAuthentication as any).mockReturnValue({
    register: mockRegister,
  });

  fireEvent.click(screen.getByRole("button", { name: "Register" }));
});

test("should show error message for existing user", async () => {
  render(<Register />);

  fireEvent.change(screen.getByLabelText("Nome"), {
    target: { value: "ExistingUser" },
  });
  fireEvent.change(screen.getByLabelText("Senha"), {
    target: { value: "password123" },
  });

  mockRegister.mockRejectedValueOnce(new Error("Usuário já existente."));

  fireEvent.click(screen.getByRole("button", { name: "Register" }));
});
