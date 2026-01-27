import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
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
        const refreshToken = localStorage.getItem("refresh_token");

        if(!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(
            `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/refresh`,
            { refresh_token: refreshToken }
        );

        const newAccessToken = response.data.token;

        const formattedToken = newAccessToken.startsWith('Bearer') ? newAccessToken : `Bearer ${newAccessToken}`;

        localStorage.setItem('token', formattedToken);

        originalRequest.headers.Authorization = formattedToken;
        return api(originalRequest);

      } catch (refreshError) {
        console.error("Session expired:", refreshError);
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  })
  
export default api;