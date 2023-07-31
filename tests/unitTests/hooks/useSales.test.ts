
import { useSales } from '@/app/hooks/useSales';
import { renderHook } from '@testing-library/react';
import axios from 'axios';
import { act } from 'react-dom/test-utils';

jest.mock('axios');

describe('useSales', () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should handlePostSales and return data', async () => {
        const { result } = renderHook(() => useSales());

        const mockedData = { status: 'success', message: 'Sales data uploaded successfully' };

        mockedAxios.post.mockResolvedValueOnce({ data: mockedData });

        const testFile = new File(['mocked data'], 'sales.txt', { type: 'text/plain' });

        const postSalesResult = await act(async () => {
            return await result.current.postSales(testFile);
        });

        expect(mockedAxios.post).toHaveBeenCalledTimes(1);
        expect(mockedAxios.post).toHaveBeenCalledWith(
            'http://localhost:4000/api/upload-sales',
            expect.any(FormData),
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        expect(postSalesResult).toEqual(mockedData);
    });

    it('should throw an error if postSales fails', async () => {
        const { result } = renderHook(() => useSales());

        const errorMessage = 'Failed to upload sales data';
        mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage));

        const testFile = new File(['mocked data'], 'sales.txt', { type: 'text/plain' });

        await expect(result.current.postSales(testFile)).rejects.toThrowError(errorMessage);
    });
});
