import { act } from "react-dom/test-utils";
import useAuthentication from "../../../src/app/hooks/useAutentication";
import Register from "../../../src/app/register/page";
import {
  RenderResult,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { ToastContainer } from "react-toastify";
import { ReactElement } from "react";

const renderWithToastify = (component: ReactElement): RenderResult => {
  return render(
    <div>
      <ToastContainer />
      {component}
    </div>
  );
};

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("../../../src/app/hooks/useAutentication", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    register: jest.fn().mockImplementation((name, password, type) => {
      if (name == "John") {
        throw Error;
      }
      return Promise.resolve({
        success: true,
      });
    }),
  })),
}));

describe("Register", () => {
  afterEach(() => {
    cleanup();
  });

  it("matches snapshot", () => {
    const { asFragment } = render(<Register />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("registers successfully with valid name, password", async () => {
    renderWithToastify(<Register />);

    const registerButton = screen.getByRole("button", { name: "Register" });

    const nameInput = screen.getByLabelText("Nome");
    const passwordInput = screen.getByLabelText("Senha");

    act(() => {
      fireEvent.change(nameInput, { target: { value: "JohnDoe" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
    });

    act(() => {
      fireEvent.click(registerButton);
    });

    expect(
      await screen.findByText("Registrado com sucesso!")
    ).toBeInTheDocument();
  });

  it("displays error messages for missing name and password", async () => {
    render(<Register />);

    const registerButton = screen.getByRole("button", { name: "Register" });

    fireEvent.click(registerButton);

    await waitFor(() =>
      expect(useAuthentication().register).not.toHaveBeenCalled()
    );

    const nameErrorMessages = screen.getAllByTestId("name-error");
    const passwordErrorMessages = screen.getAllByTestId("password-error");

    expect(nameErrorMessages[0]).toBeInTheDocument();
    expect(passwordErrorMessages[0]).toBeInTheDocument();
  });

  it("displays error message for existing user", async () => {
    renderWithToastify(<Register />);

    const registerButton = screen.getByRole("button", { name: "Register" });

    const nameInput = screen.getByLabelText("Nome");
    const passwordInput = screen.getByLabelText("Senha");

    act(() => {
      fireEvent.change(nameInput, { target: { value: "John" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
    });

    act(() => {
      fireEvent.click(registerButton);
    });

    await waitFor(() =>
      expect(screen.getByText("Usuário já existente.")).toBeInTheDocument()
    );
  });
});
