import api from '@/api/axios';
// import Cookies from 'js-cookie';

/**
 * Ініціація OAuth через POST з CSRF захистом.
 */
const submitOAuthForm = (provider) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  
  // 👇 Твій роутинг: /users/auth/:provider
  // (перевірка на подвійний слеш)
  const actionUrl = apiUrl.endsWith('/') 
    ? `${apiUrl}auth/${provider}` 
    : `${apiUrl}/auth/${provider}`;

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = actionUrl;
  
  document.body.appendChild(form);
  form.submit();
  console.log(csrfToken)
};

export const loginUser = async (credentials) => {
  const response = await api.post('/login', { user: credentials }); // axios вже має baseURL, тому /login достатньо
  
  const accessToken = response.headers['authorization'];
  const user = response.data.data;

  if (accessToken) {
    const tokenToStore = accessToken.startsWith('Bearer') ? accessToken : `Bearer ${accessToken}`;
    localStorage.setItem("token", tokenToStore);

    localStorage.setItem("user", JSON.stringify(user));
  }
  
  return user;
};

export const registerUser = async (userData) => {
  const response = await api.post('/signup', { user: userData });
  return response.data.data;
};

export const logoutUser = async () => {
  try {
    await api.delete("/logout"); 
    localStorage.removeItem("user");
  } catch (error) {
    console.error("Logout error", error);
  } finally {
    localStorage.removeItem("token");
  }
};