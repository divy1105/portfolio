import axios from 'axios';

// Humne Vercel variable hata kar seedha aapke backend ka live link daal diya hai
const BASE_URL = 'https://portfolio-8w16cd9ks-divy28study-3042s-projects.vercel.app';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});