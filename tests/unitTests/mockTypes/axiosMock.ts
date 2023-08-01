
const axiosMock = {
    get: jest.fn(() => Promise.resolve()),
    post: jest.fn(() => Promise.resolve()),
    put: jest.fn(() => Promise.resolve()),
    delete: jest.fn(() => Promise.resolve()),
};

export default axiosMock;
