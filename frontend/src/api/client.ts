import axios from 'axios';

// Yeh Vercel environment variable se aapke backend ka live URL uthayega
// Agar local PC par run kar rahe hain, toh default localhost:8000 use karega
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// API client banayein
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
