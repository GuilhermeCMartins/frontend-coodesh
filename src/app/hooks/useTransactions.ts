import axios from "axios";

const API_URL = "http://localhost:4000/api/transactions";


const useTransactions = () => {
    const handleGetAllTransactions = async () => {
        try {
            const response = await axios.get(`${API_URL}`);
            const data = response.data;
            return data.payload;
        } catch (error) {
            throw error
        }
    }

    const handleGetById = async (id: number) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            const data = response.data;
            return data.payload;
        } catch (error) {
            throw error
        }
    }

    const handleGetByVendor = async (name: string) => {
        try {
            const response = await axios.get(`${API_URL}/vendor/${name}`);
            const data = response.data;
            return data.payload;
        } catch (error) {
            throw error
        }
    }

    return {
        getAllTransactions: handleGetAllTransactions,
        getById: handleGetById,
        getByVendor: handleGetByVendor
    };
}

export { useTransactions }