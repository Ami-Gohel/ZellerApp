import React, { createContext, useContext, useState, ReactNode } from 'react';
import Toast, { ToastType } from '../components/Toast';

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    duration: number;
    visible: boolean;
  }>({
    message: '',
    type: 'info',
    duration: 1000,
    visible: false,
  });

  const showToast = (
    message: string,
    type: ToastType = 'info',
    duration: number = 1000,
  ) => {
    setToast({
      message,
      type,
      duration,
      visible: true,
    });
    setTimeout(() => {
      hideToast();
    }, duration);
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast
        message={toast.message}
        type={toast.type}
        duration={toast.duration}
        visible={toast.visible}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
