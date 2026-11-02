import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL
  || (import.meta.env.PROD ? 'https://proyecto-fullstack-api.onrender.com/api' : '/api');

const API = axios.create({
  baseURL,
});

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common.Authorization;
  }
};

export default API;
