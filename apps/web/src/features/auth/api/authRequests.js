import api from '@/api/axios';

export const loginUser = async (credentials) => {
  const response = await api.post('/login', credentials);
  
  const accessToken = response.headers['authorization'];

  const refreshToken = response.data.refresh_token

  const user = response.data.data;

  if (accessToken) localStorage.setItem("token", accessToken);
  if (refreshToken) localStorage.setItem("refresh_token", refreshToken);

  return user
};

export const registerUser = async (userData) => {
  const response = await api.post('/signup', userData);
  return response.data.data
}

export const logoutUser = async () => {
  try{
    await api.delete("/logout"); 
  } catch (error) {
    console.error("Logout error", error);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
  }
};

// export const getCurrentUser = async() => {
//   const response = await api.get("/api/v1/users");

//   return response.data;
// }
