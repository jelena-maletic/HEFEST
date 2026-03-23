import axiosInstance from "./axiosInstance";

export const login = async (username, password) => {
    const api = axiosInstance.service(false);
    return await api.post("/auth/login", { username, password });
};