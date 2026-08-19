import axios from 'axios';

// Yeh aapka direct Production link hai (Bina kisi redirect aur bina aakhiri slash ke)
const BASE_URL = 'https://portfolio-bckend.vercel.app';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});