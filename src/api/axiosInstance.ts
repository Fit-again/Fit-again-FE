import axios from "axios";

const apiOrigin = import.meta.env.PROD
    ? (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "")
    : "";

const axiosInstance = axios.create({
    baseURL: `${apiOrigin}/api/v1`,
    timeout: 10_000,
});

export default axiosInstance;
