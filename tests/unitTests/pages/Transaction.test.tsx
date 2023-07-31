import React from "react";
import { render, screen } from "@testing-library/react";
import Transactions from "@/app/transactions/page";

jest.mock("../../../src/app/hooks/useAuthentication", () => ({
  useTransactions: () => ({
    getByVendor: jest.fn().mockResolvedValue({
      transactions: [
        {
          Id: 1,
          Vendor: { Name: "Vendor 1" },
          Product: { Name: "Product 1" },
          TransactionType: { Inbound: true },
          Price: "10.00",
          MadeAt: new Date().toISOString(),
        },
        {
          Id: 2,
          Vendor: { Name: "Vendor 2" },
          Product: { Name: "Product 2" },
          TransactionType: { Inbound: false },
          Price: "15.00",
          MadeAt: new Date().toISOString(),
        },
      ],
    }),
  }),
}));

describe("Transactions Page", () => {
  test("renders transactions table", async () => {
    render(<Transactions />);
    
    await screen.findByText("Vendedor");
    await screen.findByText("Product 1");
    await screen.findByText("Product 2");

    expect(screen.getByText("Vendor 1")).toBeInTheDocument();
    expect(screen.getByText("Vendor 2")).toBeInTheDocument();
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Product 2")).toBeInTheDocument();
    expect(screen.getByText("R$10.00")).toBeInTheDocument();
    expect(screen.getByText("R$15.00")).toBeInTheDocument();
  });

  test("pagination works correctly", async () => {
    render(<Transactions />);

    await screen.findByText("Vendedor");
    await screen.findByText("Product 1");
    await screen.findByText("Product 2");

    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.queryByText("Product 2")).not.toBeInTheDocument();

    screen.getByLabelText("Próxima página").click();
    await screen.findByText("Product 2");

    expect(screen.queryByText("Product 1")).not.toBeInTheDocument();
    expect(screen.getByText("Product 2")).toBeInTheDocument();
  });
});
