import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const OAuthCallback = ({ onLoginSuccess }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
        
        const formattedToken = token.startsWith('Bearer') ? token : `Bearer ${token}`;
        localStorage.setItem("token", formattedToken);

        onLoginSuccess();
        navigate("/projects")
        } else {
            navigate("/login?error=OAuthFailed")
        }
    }, [searchParams, navigate, onLoginSuccess]);

    return <Loader center />
}
export default OAuthCallback;