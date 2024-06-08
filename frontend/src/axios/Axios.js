import axios from 'axios'
import { baseURL } from '../utils/Constants'

const instance = axios.create({
    baseURL:baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

export const axiosPrivateInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

export default instance;