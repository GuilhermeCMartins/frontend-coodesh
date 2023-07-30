import axios from "axios";

const API_URL = "http://localhost:4000/api/upload-sales";

const useSales = () => {
    const handlePostSales = async (txt: File) => {
        try {
            const formData = new FormData();
            formData.append("salesFile", txt);

            const response = await axios.post(API_URL, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const data = response.data;
            return data;
        } catch (error) {
            throw error;
        }
    };

    return {
        postSales: handlePostSales,
    };
};

export { useSales };
