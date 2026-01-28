import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {

        const response = await api.post("/refresh");

        const newAccessToken = response.data.token;

        const formattedToken = newAccessToken.startsWith('Bearer') ? newAccessToken : `Bearer ${newAccessToken}`;

        localStorage.setItem('token', formattedToken);

        originalRequest.headers.Authorization = formattedToken;
        return api(originalRequest);

      } catch (refreshError) {
        console.error("Session expired:", refreshError);
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  })
  
export default api;