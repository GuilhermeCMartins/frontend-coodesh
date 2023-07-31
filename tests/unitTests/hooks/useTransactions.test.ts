import { useTransactions } from "@/app/hooks/useTransactions";
import { renderHook } from "@testing-library/react";
import axios from "axios";

jest.mock('axios');

describe('useTransactions', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should handleGetAllTransactions and return data', async () => {
        const mockedData = { payload: [{ id: 1, amount: 100 }, { id: 2, amount: 200 }] };
        (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({ data: mockedData });

        const { result } = renderHook(() => useTransactions());

        const getAllTransactionsResult = await result.current.getAllTransactions();

        expect(axios.get).toHaveBeenCalledWith('http://localhost:4000/api/transactions');
        expect(getAllTransactionsResult).toEqual(mockedData.payload);
    });

    it('should handleGetById and return data', async () => {
        const id = 1;
        const mockedData = { payload: { id: 1, amount: 100 } };
        (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({ data: mockedData });

        const { result } = renderHook(() => useTransactions());

        const getByIdResult = await result.current.getById(id);

        expect(axios.get).toHaveBeenCalledWith(`http://localhost:4000/api/transactions/${id}`);
        expect(getByIdResult).toEqual(mockedData.payload);
    });

    it('should handleGetByVendor and return data', async () => {
        const name = 'Vendor A';
        const mockedData = { payload: [{ id: 1, amount: 100 }, { id: 2, amount: 200 }] };
        (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({ data: mockedData });

        const { result } = renderHook(() => useTransactions());

        const getByVendorResult = await result.current.getByVendor(name);

        expect(axios.get).toHaveBeenCalledWith(`http://localhost:4000/api/transactions/vendor/${name}`);
        expect(getByVendorResult).toEqual(mockedData.payload);
    });
});
