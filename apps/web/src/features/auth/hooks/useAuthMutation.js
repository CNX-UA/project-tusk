import { useMutation } from "@tanstack/react-query";
import { loginUser, registerUser } from "../api/authRequests";

export const useAuthMutation = (onLoginSuccess) => {
  const login = useMutation({
    mutationFn: loginUser,
    onSuccess: (user) => {

      onLoginSuccess(user)    
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