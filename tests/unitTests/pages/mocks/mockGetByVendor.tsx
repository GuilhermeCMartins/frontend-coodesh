import { mockTransactions } from "./mockTransactions";

export const useTransactionsMock = () => {
  const getByVendor = jest.fn().mockResolvedValue({
    transactions: mockTransactions.filter(
      (transaction) => transaction.Vendor.Name === "Vendor 1"
    ),
  });

  return {
    getByVendor,
  };
};
