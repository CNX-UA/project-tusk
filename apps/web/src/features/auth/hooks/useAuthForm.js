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

    return {
        formik, isLoading, 
        isError: login.isError || register.isError,
        errorMessage: error?.response?.data?.error || "Something wrong.."
    };
};
