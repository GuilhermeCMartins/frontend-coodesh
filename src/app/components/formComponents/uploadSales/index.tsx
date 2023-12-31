import React, { useState } from "react";
import {
  Box,
  Input,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useSales } from "@/app/hooks/useSales";

export interface UploadSalesProps {
  onClose: () => void;
  onUploadSuccess: () => void;
  open: boolean;
}

interface ErrorResponse {
  success: boolean;
  errors: Array<{
    line: string;
    errors: string[];
  }>;
}

const UploadSales: React.FC<UploadSalesProps> = ({
  onClose,
  open,
  onUploadSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { postSales } = useSales();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.warning("Por favor, selecione um arquivo antes de fazer o upload.");
      return;
    }

    setUploading(true);
    try {
      await postSales(selectedFile);
      toast.success("Arquivo de vendas enviado com sucesso!");
      onUploadSuccess();
      onClose();
    } catch (error) {
      const errorResponse = (error as AxiosError<ErrorResponse>)?.response
        ?.data;
      if (errorResponse?.success === false) {
        toast.error(`O arquivo de vendas contém erros de digitação.`, {
          pauseOnHover: true,
        });
        onClose();
      } else {
        toast.error(
          "Erro ao enviar arquivo de vendas. Por favor, tente novamente."
        );
      }
      if (errorResponse) {
        errorResponse.errors = [];
      }
      setSelectedFile(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Upload de Vendas</DialogTitle>
      <DialogContent>
        <Box p={3}>
          <Box display="flex" alignItems="center" marginBottom={2}>
            <Input
              type="file"
              inputProps={{ accept: ".csv, .xlsx, .xls, .txt" }}
              onChange={handleFileSelect}
              fullWidth
              data-testid="file-input"
            />
            <Box marginLeft={2}>
              <Button
                variant="contained"
                onClick={handleFileUpload}
                disabled={uploading}
                data-testid="upload-button"
              >
                {uploading ? <CircularProgress size={24} /> : "Enviar Arquivo"}
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UploadSales;
