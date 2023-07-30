import axios from "axios";

const API_URL = "http://localhost:4000/api/auth";

interface User {
    name: string;
    type: string;
    token: string;
}

const useAuthentication = () => {
    const handleLogin = async (name: string, password: string) => {
        try {
            const response = await axios.post<User>(`${API_URL}/login`, {
                name,
                password,
            });
            const loggedInUser = response.data;

            localStorage.setItem("token", loggedInUser.token);

            return loggedInUser;
        } catch (error) {
            throw error;
        }
    };

    const handleRegister = async (name: string, password: string, type: string) => {
        try {
            const response = await axios.post<User>(`${API_URL}/register`, {
                name,
                password,
                type,
            });
            const registeredUser = response.data;
            return registeredUser;
        } catch (error) {
            throw error;
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
    }

    const getTokenFromLocalStorage = () => {
        return localStorage.getItem("token");
    };

    return {
        login: handleLogin,
        register: handleRegister,
        getToken: getTokenFromLocalStorage,
        logout: handleLogout
    };
};

export default useAuthentication;
