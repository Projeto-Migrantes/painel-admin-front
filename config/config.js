import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

// Configura API REST 
export const api = axios.create({
    baseURL: process.env.API_URL,
    timeout: 20000
});

export default {
  apiUrl: process.env.API_URL,
  port: process.env.PORT || 3000,
};
