import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/csrf',
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token.startsWith('Bearer') ? token : `Bearer ${token}`;
  }

  const csrfToken = Cookies.get('XSRF-TOKEN');
  if (csrfToken){
    config.headers['X-XSRF-TOKEN'] = csrfToken;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/refresh')) {
      originalRequest._retry = true;

      try {

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000'/users/refresh}`,
          {},
          { withCredentials: true,
            headers: {
              "X-XSRF-TOKEN": Cookies.get('XSRF-TOKEN')
            }
           }
        );

        const newAccessToken = response.headers['authorization'] || response.data.token;

        if(newAccessToken) {
          const formattedToken = newAccessToken.startsWith('Bearer') ? newAccessToken : `Bearer ${newAccessToken}`;
          localStorage.setItem('token', formattedToken);
          api.defaults.headers.common['Authorization'] = formattedToken;

          originalRequest.headers.Authorization = formattedToken;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Session expired:", refreshError);
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        window.location.href = '/login?error=SessionExpired';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  });
  
export default api;