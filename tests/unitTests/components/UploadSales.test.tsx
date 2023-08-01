import React, { ReactElement } from "react";
import { RenderResult, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UploadSales, {
  UploadSalesProps,
} from "@/app/components/formComponents/uploadSales";
import { ToastContainer } from "react-toastify";
import axiosMock from "../mockTypes/axiosMock";

const mockOnClose = jest.fn();
const mockOnUploadSuccess = jest.fn();

const renderWithToastify = (component: ReactElement): RenderResult => {
  return render(
    <div>
      <ToastContainer />
      {component}
    </div>
  );
};

const renderUploadSales = (props?: Partial<UploadSalesProps>) => {
  const defaultProps: UploadSalesProps = {
    onClose: mockOnClose,
    onUploadSuccess: mockOnUploadSuccess,
    open: true,
  };
  return renderWithToastify(<UploadSales {...defaultProps} {...props} />);
};

describe("UploadSales", () => {
  let file: File;

  beforeEach(() => {
    jest.clearAllMocks();
    file = new File(["(⌐□_□)"], "teste.csv", { type: "text/csv" });
  });

  it("should display a warning toast when trying to upload without selecting a file", async () => {
    renderUploadSales();

    const uploadButton = screen.getByRole("button", {
      name: /enviar arquivo/i,
    });

    await waitFor(() => {
      userEvent.click(uploadButton);
    });

    await waitFor(() => {
      const toast = screen.queryAllByText(
        "Por favor, selecione um arquivo antes de fazer o upload."
      );
      expect(toast[0]).toBeInTheDocument();
    });

    expect(mockOnUploadSuccess).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
    expect(axiosMock.post).not.toHaveBeenCalled();
  });
});
