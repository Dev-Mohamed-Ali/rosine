import axios from 'axios';


const API = axios.create({ baseURL:process.env.REACT_APP_BASE_URL });

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status, data } = error.response;
    if (status === 401) {
      // Handle unauthorized requests
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;

