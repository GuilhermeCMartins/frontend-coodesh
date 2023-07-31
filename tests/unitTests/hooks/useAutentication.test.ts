import useAuthentication from "@/app/hooks/useAutentication";
import axios from "axios";
import { User } from "../mockTypes/types";

jest.mock("axios");

const localStorageMock = (() => {
    let store: { [key: string]: string } = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => (store[key] = value),
        removeItem: (key: string) => delete store[key],
        clear: () => (store = {}),
    };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("useAuthentication", () => {
    afterEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    describe("handleLogin", () => {
        it("should log in successfully and store the token in localStorage", async () => {
            const mockLoggedInUser: User = {
                name: "John",
                type: "user",
                token: "mockToken",
            };
            const name = "John";
            const password = "password";

            (axios.post as jest.Mock).mockResolvedValueOnce({ data: mockLoggedInUser });

            const auth = useAuthentication();
            const loggedInUser = await auth.login(name, password);

            expect(loggedInUser).toEqual(mockLoggedInUser);
            expect(localStorage.getItem("token")).toBe(mockLoggedInUser.token);
        });

        it("should throw an error when login fails", async () => {
            const name = "John";
            const password = "incorrectPassword";

            (axios.post as jest.Mock).mockRejectedValueOnce(new Error("Invalid credentials"));

            const auth = useAuthentication();

            await expect(auth.login(name, password)).rejects.toThrow("Invalid credentials");
            expect(localStorage.getItem("token")).toBeNull();
        });
    });

    describe("handleRegister", () => {
        it("should register a new user successfully", async () => {
            const mockRegisteredUser: User = {
                name: "Jane",
                type: "user",
                token: "mockToken",
            };
            const name = "Jane";
            const password = "password";
            const type = "user";

            (axios.post as jest.Mock).mockResolvedValueOnce({ data: mockRegisteredUser });

            const auth = useAuthentication();
            const registeredUser = await auth.register(name, password, type);

            expect(registeredUser).toEqual(mockRegisteredUser);
        });
    });

    describe("handleLogout", () => {
        it("should remove the token from localStorage on logout", () => {
            const auth = useAuthentication();

            localStorage.setItem("token", "mockToken");

            auth.logout();
            expect(localStorage.getItem("token")).toBeNull();
        });
    });

    describe("getTokenFromLocalStorage", () => {
        it("should return the token from localStorage", () => {
            const auth = useAuthentication();
            const mockToken = "mockToken";

            localStorage.setItem("token", mockToken);

            const token = auth.getToken();
            expect(token).toBe(mockToken);
        });

        it("should return null when no token is available in localStorage", () => {
            const auth = useAuthentication();

            const token = auth.getToken();
            expect(token).toBeNull();
        });
    });
});
