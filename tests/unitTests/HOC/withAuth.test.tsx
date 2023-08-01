import React, { ReactElement } from "react";
import { RenderResult, render, screen, waitFor } from "@testing-library/react";
import { ToastContainer } from "react-toastify";
import useAuthentication from "../../../src/app/hooks/useAutentication";
import withAuthentication from "@/app/HOC/withAuth";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("../../../src/app/hooks/useAutentication", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getToken: jest.fn(),
  })),
}));

const renderWithToastify = (component: ReactElement): RenderResult => {
  return render(
    <div>
      <ToastContainer />
      {component}
    </div>
  );
};

const MockComponent: React.FC = () => (
  <div data-testid="mock-component">Mock Component</div>
);

describe("withAuthentication HOC", () => {
  it("should render the wrapped component when authenticated", () => {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: () => "mockToken",
      },
    });

    (useAuthentication as jest.Mock).mockReturnValueOnce({
      getToken: () => "mockToken",
    });

    const WrappedComponent = withAuthentication(MockComponent);

    render(<WrappedComponent />);

    expect(screen.getByTestId("mock-component")).toBeInTheDocument();
  });

  it("should display a loading state when checking authentication", () => {
    (useAuthentication as jest.Mock).mockReturnValueOnce({
      getToken: () => null,
    });

    const WrappedComponent = withAuthentication(MockComponent);

    const { container } = render(<WrappedComponent />);

    expect(
      container.querySelector(".MuiCircularProgress-root")
    ).toBeInTheDocument();
  });

  it("should redirect to the login page when not authenticated", async () => {
    (useAuthentication as jest.Mock).mockReturnValueOnce({
      getToken: () => null,
    });

    const WrappedComponent = withAuthentication(MockComponent);

    renderWithToastify(<WrappedComponent />);

    await waitFor(() => {
      const toast = screen.queryAllByText(
        "Você não está autenticado. Redirecionando para a página de login..."
      );
      expect(toast[0]).toBeInTheDocument();
    });
  });
});
