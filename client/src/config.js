import axios from "axios";

export const axiosInstance = axios.create({
    // baseURL: "https://find-nearby-places.onrender.com/api/"
    baseURL: "http://localhost:5000/api/"
});