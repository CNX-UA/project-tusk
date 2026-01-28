import { useMutation } from "@tanstack/react-query";
import { loginUser, registerUser } from "../api/authRequests";

export const useAuthMutation = (onLoginSuccess) => {
  const login = useMutation({
    mutationFn: loginUser,
    onSuccess: (result) => {
      const token = result.token
      if (token) localStorage.setItem("token", result.data);
      onLoginSuccess(result.data)    
    }, 
  });

  const register = useMutation({
    mutationFn: registerUser,
    onSuccess: (_, variables) => {
      login.mutate(variables);
    },
  })
  return { login, register };
};