"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import Navbar from "../components/basicComponents/navbar";
import DashboardCards from "../components/dashboardComponents/container";
import { useTransactions } from "../hooks/useTransactions";
import { Transaction } from "../types/types";
import jwt from "jsonwebtoken";

interface Token {
  vendorName: string;
  iat: number;
  exp: number;
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { getByVendor } = useTransactions();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    try {
      if (token) {
        const decodedToken = jwt.decode(token);
        const { vendorName } = decodedToken as Token;
        getByVendor(vendorName)
          .then((data) => {
            setTransactions(data.transactions);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching transactions:", error);
            setIsLoading(false);
          });
      }
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getTotalInbound = () => {
    const totalInbound = transactions.reduce((total, transaction) => {
      if (transaction.TransactionType.Inbound) {
        return total + parseFloat(transaction.Price);
      }
      return total;
    }, 0);
    return totalInbound;
  };

  const getTotalOutbound = () => {
    const totalOutbound = transactions.reduce((total, transaction) => {
      if (!transaction.TransactionType.Inbound) {
        return total + parseFloat(transaction.Price);
      }
      return total;
    }, 0);
    return totalOutbound;
  };

  return (
    <Container>
      <Navbar />
      <DashboardCards type="transactions">
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            TRANSAÇÕES
          </Typography>
          {isLoading ? (
            <Box
              style={{
                width: "30vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="body1" gutterBottom>
                Carregando...
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Vendedor</TableCell>
                      <TableCell>Produto</TableCell>
                      <TableCell>Preço</TableCell>
                      <TableCell>Data</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((transaction) => (
                        <TableRow key={transaction.Id}>
                          <TableCell data-testid="vendor-name">
                            {transaction.Vendor.Name}
                          </TableCell>
                          <TableCell data-testid="product-name">
                            {transaction.Product.Name}
                          </TableCell>
                          <TableCell
                            data-testid="product-price"
                            style={{
                              color: transaction.TransactionType.Inbound
                                ? "green"
                                : "red",
                            }}
                          >
                            R${transaction.Price}
                          </TableCell>
                          <TableCell>
                            {new Date(transaction.MadeAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={transactions.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </Box>
        <Divider orientation="vertical" flexItem variant="middle" />
        <Box
          p={3}
          display={"flex"}
          alignItems={"flex-start"}
          justifyContent={"flex-start"}
          flexDirection={"column"}
          gap={12}
        >
          <Box>
            <Typography variant="h6" gutterBottom>
              Total das transações:
            </Typography>
            <Box data-testid="inbound">
              Entrada:{" "}
              <Typography variant="h6" gutterBottom color="green">
                R${getTotalInbound().toFixed(2)}
              </Typography>
            </Box>
            <Box data-testid="outbound">
              Saída:{" "}
              <Typography variant="h6" gutterBottom color="red">
                R${getTotalOutbound().toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DashboardCards>
    </Container>
  );
}
