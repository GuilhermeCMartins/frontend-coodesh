import React, { ReactElement } from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  RenderResult,
} from "@testing-library/react";
import Login from "@/app/page";
import "@testing-library/jest-dom/extend-expect";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import { act } from "react-dom/test-utils";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const renderWithToastify = (component: ReactElement): RenderResult => {
  return render(
    <div>
      <ToastContainer />
      {component}
    </div>
  );
};

const pushMock = jest.fn();

jest.mock("../../../src/app/hooks/useAutentication", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    login: jest.fn().mockImplementation((name, password) => {
      if (name === "usuario_incorreto") {
        throw Error;
      }
      return Promise.resolve({
        success: true,
      });
    }),
  })),
}));

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

  it("matches snapshot", () => {
    const { asFragment } = render(<Login />);
    expect(asFragment()).toMatchSnapshot();
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
    renderWithToastify(<Login />);
    const nameInput = screen.getByLabelText("Nome");
    const passwordInput = screen.getByLabelText("Senha");
    const loginButton = screen.getByText("Entrar");

    act(() => {
      fireEvent.change(nameInput, { target: { value: "usuario123" } });
      fireEvent.change(passwordInput, { target: { value: "senha123" } });
    });

    act(() => {
      fireEvent.click(loginButton);
    });

    await waitFor(() =>
      expect(screen.getByText("Login bem sucedido!")).toBeInTheDocument()
    );
  });

  it("should fail to login with incorrect credentials", async () => {
    renderWithToastify(<Login />);
    const nameInput = screen.getByLabelText("Nome");
    const passwordInput = screen.getByLabelText("Senha");
    const loginButton = screen.getByText("Entrar");

    act(() => {
      fireEvent.change(nameInput, { target: { value: "usuario_incorreto" } });
      fireEvent.change(passwordInput, { target: { value: "senha_incorreta" } });
    });

    act(() => {
      fireEvent.click(loginButton);
    });

    await waitFor(() =>
      expect(
        screen.getByText("Usuário ou senha incorretos.")
      ).toBeInTheDocument()
    );
  });
});
