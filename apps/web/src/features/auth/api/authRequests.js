import api from '@/api/axios';

export const loginUser = async (credentials) => {
  const response = await api.post('/login', {
    user: credentials
  });
  
  return {
    data: response.data,
    token: response.headers.authorization,
  };
};

export const registerUser = async (credentials) => {
  const response = await api.post('/signup', {
    user: { 
      ...credentials, 
      password_confirmation: credentials.password 
    },
  });
  
  return response.data;
};