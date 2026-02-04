import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useToast } from "@/context/ToastProvider";

const OAuthCallback = ({ onLoginSuccess }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const processed = useRef(false);

    useEffect(() => {
        const token = searchParams.get("token");
        const email = searchParams.get("email");
        const error = searchParams.get("error");

        if (error) {
            useToast("Login failed via provider", "error");
            navigate("/login");
            return;
        }

        if (token) {
            try{
                const formattedToken = token.startsWith('Bearer') ? token : `Bearer ${token}`;
                localStorage.setItem("token", formattedToken);
                
                if(email){
                    localStorage.setItem("userEmail", email);
                }
                useToast("Successfully logged in!", "success");
                onLoginSuccess(); // Оновлюємо глобальний стейт App.jsx
                navigate("/projects");
            } catch (err){
                console.error("Auth processing error:", err);
                navigate("/login?error=ProcessingFailed");
            }}
        else {
            // Якщо бекенд не прислав токен
            navigate("/login?error=NoToken");
        }
    },[searchParams, navigate, onLoginSuccess]);

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh',
            gap: 2
        }}>
            <CircularProgress size={50} thickness={4} />
            <Typography variant="body1" color="text.secondary">
                Completing secure login...
            </Typography>
        </Box>
    );
}
export default OAuthCallback;