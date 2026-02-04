import api from '@/api/axios';
import Cookies from 'js-cookie';

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
  
  // 👇 Читаємо токен з кук і додаємо в форму
  const csrfToken = Cookies.get('XSRF-TOKEN');
  if (csrfToken) {
    const hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = 'authenticity_token'; // Rails чекає саме це поле
    hiddenField.value = csrfToken;
    form.appendChild(hiddenField);
  }

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
  }
  
  return user;
};

export const registerUser = async (userData) => {
  const response = await api.post('/signup', { user: userData });
  return response.data.data;
};

export const loginWithGoogle = () => {
  submitOAuthForm('google_oauth2');
};

export const loginWithGithub = () => {
  submitOAuthForm('github');
};

export const logoutUser = async () => {
  try {
    await api.delete("/logout"); 
  } catch (error) {
    console.error("Logout error", error);
  } finally {
    localStorage.removeItem("token");
  }
};