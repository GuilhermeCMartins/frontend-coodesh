import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import DashboardPage from "../../../src/app/dashboard/page";
import { mockTransactions } from "./mocks/mockTransactions";
import { UploadSalesProps } from "@/app/components/formComponents/uploadSales";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("../../../src/app/HOC/withAuth.tsx", () => {
  return (Component: React.ComponentType<any>) => {
    const WrappedComponent: React.FC<any> = (props) => <Component {...props} />;
    WrappedComponent.displayName = `withAuthentication(${
      Component.displayName || Component.name || "Component"
    })`;
    return WrappedComponent;
  };
});

jest.mock("../../../src/app/hooks/useTransactions", () => ({
  useTransactions: () => ({
    getAllTransactions: jest.fn().mockResolvedValue({
      transactions: mockTransactions,
    }),
  }),
}));

jest.mock("../../../src/app/components/formComponents/uploadSales", () => ({
  __esModule: true,
  default: ({ open, onClose }: UploadSalesProps) => (
    <div data-testid="upload-sales-dialog">
      UploadSales Dialog Content
      <button onClick={onClose} data-testid="close-button">
        Close
      </button>
    </div>
  ),
}));

describe("DashboardPage", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<DashboardPage />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders the dashboard with transaction data", async () => {
    render(<DashboardPage />);

    await waitFor(
      () => expect(screen.queryByText("Carregando...")).not.toBeInTheDocument(),
      {
        timeout: 5000,
        interval: 100,
      }
    );

    await waitFor(async () => {
      const vendorNameElement = await screen.findByTestId("vendor-name");
      const productNameElement = await screen.findByTestId("product-name");
      const productPriceElement = await screen.findByTestId("product-price");

      expect(vendorNameElement.textContent).toBe("Vendor 1");
      expect(productNameElement.textContent).toBe("Product 1");
      expect(productPriceElement.textContent).toBe("R$10.00");
    });
  });

  it("applies filters correctly", async () => {
    render(<DashboardPage />);

    await waitFor(
      () => expect(screen.queryByText("Carregando...")).not.toBeInTheDocument(),
      {
        timeout: 5000,
        interval: 100,
      }
    );

    const vendorFilterInput = screen.getByRole("textbox", {
      name: /Filtrar por Vendedor/i,
    });
    const productFilterInput = screen.getByRole("textbox", {
      name: /Filtrar por Produto/i,
    });
    const minPriceFilterInput = screen.getByRole("textbox", {
      name: /Preço Mínimo/i,
    });

    fireEvent.change(vendorFilterInput, { target: { value: "Vendor 1" } });
    fireEvent.change(productFilterInput, { target: { value: "Product 1" } });
    fireEvent.change(minPriceFilterInput, { target: { value: "5.00" } });

    const applyFiltersButton = screen.getByRole("button", {
      name: /Aplicar Filtros/i,
    });
    fireEvent.click(applyFiltersButton);

    await waitFor(async () => {
      const vendorNameElement = await screen.findByTestId("vendor-name");
      const productNameElement = await screen.findByTestId("product-name");
      const productPriceElement = await screen.findByTestId("product-price");

      expect(vendorNameElement.textContent).toBe("Vendor 1");
      expect(productNameElement.textContent).toBe("Product 1");
      expect(productPriceElement.textContent).toBe("R$10.00");
    });
  });

  it("opens UploadSales dialog", async () => {
    render(<DashboardPage />);
    const openUploadSalesButton = screen.getByText("Upload transações");

    fireEvent.click(openUploadSalesButton);

    const uploadSalesDialogContent = screen.getByText(
      "UploadSales Dialog Content"
    );

    expect(uploadSalesDialogContent).toBeInTheDocument();
  });

  it("calculates total transactions correctly", async () => {
    render(<DashboardPage />);

    await screen.findByText("TRANSAÇÕES");

    await waitFor(
      () => expect(screen.queryByText("Carregando...")).not.toBeInTheDocument(),
      {
        timeout: 5000,
        interval: 100,
      }
    );

    const totalInbound = mockTransactions.reduce((total, transaction) => {
      return transaction.TransactionType.Inbound
        ? total + parseFloat(transaction.Price)
        : total;
    }, 0);

    const totalOutbound = mockTransactions.reduce((total, transaction) => {
      return !transaction.TransactionType.Inbound
        ? total + parseFloat(transaction.Price)
        : total;
    }, 0);

    const totalInboundElement = screen.getByTestId("inbound");
    const totalOutboundElement = screen.getByTestId("outbound");

    expect(totalInboundElement.textContent).toBe(
      `Entrada: R$${totalInbound.toFixed(2)}`
    );
    expect(totalOutboundElement.textContent).toBe(
      `Saída: R$${totalOutbound.toFixed(2)}`
    );
  });
});
