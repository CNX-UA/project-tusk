import { useFormik } from "formik";
import { useAuthMutation } from "./useAuthMutation";
import { authSchema } from "../schema/authSchema";

export const useAuthForm = ( onLoginSuccess, tabValue ) => {
    const {login, register} = useAuthMutation(onLoginSuccess);

    const formik = useFormik({
        initialValues:{
            email: "",
            password: "",
        },
        validationSchema: authSchema,
        onSubmit: (values) => {
            tabValue === 0 ? login.mutate(values) : register.mutate(values);

        }
    });

    const isLoading = login.isPending || register.isPending;
    const error  = login.error || register.error;

    const getErrorMessage = (err) => {
      if (!err?.response?.data) return "Something went wrong";
      
      const data = err.response.data;
      
      if (data.status?.message) return data.status.message;
      
      if (data.error) return data.error;
      if (data.message) return data.message;
      
      return "Something went wrong";
    };

    return {
        formik, isLoading, 
        isError: login.isError || register.isError,
        errorMessage: getErrorMessage(error)
    };
};
