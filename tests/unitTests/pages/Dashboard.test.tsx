import React from "react";
import { render, screen } from "@testing-library/react";
import DashboardPage from "../../../src/app/dashboard/page";
import { WithAuthenticationType } from "../mockTypes/types";

const withAuthenticationMock: WithAuthenticationType = (Component) => {
  const WrappedComponent = (props: any) => <Component {...props} />;
  WrappedComponent.displayName = `withAuthentication(${
    Component.displayName || Component.name || "Component"
  })`;
  return WrappedComponent;
};

jest.mock("next/navigation");
jest.mock("../../../src/app/HOC/withAuth", () => withAuthenticationMock);

describe("Dashboard", () => {
  it("should render the DashboardPage", () => {
    render(<DashboardPage />);

    expect(screen.getByLabelText("Filtrar por Vendedor")).toBeInTheDocument();
    expect(screen.getByLabelText("Filtrar por Produto")).toBeInTheDocument();
    expect(screen.getByLabelText("Preço Mínimo")).toBeInTheDocument();
    expect(screen.getByText("Vendedor")).toBeInTheDocument();
    expect(screen.getByText("Produto")).toBeInTheDocument();
    expect(screen.getByText("Preço")).toBeInTheDocument();
    expect(screen.getByText("Data")).toBeInTheDocument();
    expect(screen.getByText("Upload transações")).toBeInTheDocument();
    expect(screen.getByText("Entrada:")).toBeInTheDocument();
    expect(screen.getByText("Saída:")).toBeInTheDocument();
  });
});
