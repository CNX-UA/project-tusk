import { createContext, useContext, useState, useCallback} from 'react';
import Toast from '@/components/ui/Toast';

const ToastContext = createContext(null);

export const ToastProvider = ({ children}) => {
    const [ toast, setToast] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    const showToast = useCallback((message, severity = 'info') => {
        setToast({
            open: true, 
            message,
            severity
        }); 
    }, [])

    const closeToast = useCallback(() => {
        setToast((prev) => ({ ...prev, open: false}));
    }, [])

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Toast
            open={toast.open}
            message={toast.message}
            severity={toast.severity}
            onClose={closeToast}
            />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if(!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
}