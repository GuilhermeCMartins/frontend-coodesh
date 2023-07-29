"use client";
import { Transaction } from "@/app/types/types";
import { useState, useEffect } from "react";

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/transactions");
        const data = await response.json();
        setTransactions(data.payload.transactions);
      } catch (error) {
        console.error("Erro ao buscar as transações:", error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <main>
      <h1>Teste</h1>
      <ul>
        {transactions?.map((transaction) => (
          <li key={transaction.Id}>
            {transaction.Product.Name} - {transaction.Price}
          </li>
        ))}
      </ul>
    </main>
  );
}
