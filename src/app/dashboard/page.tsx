"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Container,
  TextField,
  Button,
} from "@mui/material";
import { Transaction } from "../types/types";
import { useTransactions } from "../hooks/useTransactions";
import { toast } from "react-toastify";
import UploadSales from "../components/formComponents/uploadSales";
import withAuthentication from "../HOC/withAuth";
import useAuthentication from "../hooks/useAutentication";
import { useRouter } from "next/navigation";
import AppMenu from "../components/dashboardComponents/menu";

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [vendorFilter, setVendorFilter] = useState<string>("");
  const [productFilter, setProductFilter] = useState<string>("");
  const [minPriceFilter, setMinPriceFilter] = useState<number | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const { getAllTransactions } = useTransactions();
  const { logout } = useAuthentication();
  const router = useRouter();

  const handleOpenUploadDialog = () => {
    setIsUploadDialogOpen(true);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
    toast.success("Usuario deslogado com sucesso.");
  };

  const handleCloseUploadDialog = () => {
    setIsUploadDialogOpen(false);
  };

  const handleFetchTransactions = async () => {
    try {
      const { transactions } = await getAllTransactions();
      setTransactions(transactions);
    } catch (error) {
      toast.error("Erro ao buscar transações");
    }
  };

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

  const handleApplyFilters = () => {
    const filteredTransactions = transactions.filter((transaction) => {
      const vendorMatches = transaction.Vendor.Name.toLowerCase().includes(
        vendorFilter.toLowerCase()
      );
      const productMatches = transaction.Product.Name.toLowerCase().includes(
        productFilter.toLowerCase()
      );
      const priceMatches =
        minPriceFilter === null ||
        parseFloat(transaction.Price) >= minPriceFilter;
      return vendorMatches && productMatches && priceMatches;
    });

    setTransactions(filteredTransactions);
    setPage(0);
  };

  const handleClearFilters = () => {
    setVendorFilter("");
    setProductFilter("");
    setMinPriceFilter(null);
    setPage(0);
    handleFetchTransactions();
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

  useEffect(() => {
    handleFetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <AppMenu />
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Filtros
        </Typography>
        <Box display="flex" alignItems="center" marginBottom={2}>
          <TextField
            label="Filtrar por Vendedor"
            value={vendorFilter}
            onChange={(e) => setVendorFilter(e.target.value)}
            size="small"
            variant="outlined"
          />
          <TextField
            label="Filtrar por Produto"
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            size="small"
            variant="outlined"
          />
          <TextField
            label="Preço Mínimo"
            value={minPriceFilter !== null ? minPriceFilter : ""}
            onChange={(e) => setMinPriceFilter(parseFloat(e.target.value))}
            size="small"
            variant="outlined"
          />
          <Box marginLeft={2}>
            <Button variant="contained" onClick={handleApplyFilters}>
              Aplicar Filtros
            </Button>
          </Box>
          <Box marginLeft={2}>
            <Button variant="outlined" onClick={handleClearFilters}>
              Limpar Filtros
            </Button>
          </Box>
        </Box>
      </Box>
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <TableContainer>
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
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((transaction) => (
                    <TableRow key={transaction.Id}>
                      <TableCell>{transaction.Vendor.Name}</TableCell>
                      <TableCell>{transaction.Product.Name}</TableCell>
                      <TableCell
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
        </TableContainer>
      </Box>
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Totais
        </Typography>
        <Typography variant="h6" gutterBottom>
          Inbound: R${getTotalInbound().toFixed(2)}
        </Typography>
        <Typography variant="h6" gutterBottom color="darkred">
          Outbound: R${getTotalOutbound().toFixed(2)}
        </Typography>
      </Box>
      <Button variant="outlined" onClick={handleOpenUploadDialog}>
        Abrir Diálogo de Upload
      </Button>
      <UploadSales
        open={isUploadDialogOpen}
        onClose={handleCloseUploadDialog}
        onUploadSuccess={handleFetchTransactions}
      />
    </Container>
  );
};

export default withAuthentication(Dashboard);
