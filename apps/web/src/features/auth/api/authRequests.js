import api from '@/api/axios';

export const loginUser = async (credentials) => {
  const response = await api.post('/login', { user: credentials });

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
}

export const logoutUser = async () => {

  try {
    
    await api.delete("/logout"); 
  } catch (error) {
    console.error("Logout error", error);
  } finally {
    localStorage.removeItem("token");
  }
};