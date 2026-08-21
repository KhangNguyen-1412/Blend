import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none font-body">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-5 py-3 shadow-[4px_4px_0px_rgba(18,72,116,0.9)] border-2 text-sm animate-editorial-in ${
              toast.type === 'success'
                ? 'bg-[#FCFAF6] text-blend-cerulean border-blend-cerulean'
                : toast.type === 'error'
                ? 'bg-[#FCFAF6] text-blend-jasper border-blend-jasper'
                : 'bg-[#FCFAF6] text-blend-cerulean border-blend-cerulean'
            }`}
          >
            <i
              className={`fa-solid ${
                toast.type === 'success'
                  ? 'fa-circle-check text-emerald-700'
                  : toast.type === 'error'
                  ? 'fa-circle-exclamation text-blend-jasper'
                  : 'fa-circle-info text-blend-cerulean'
              }`}
            ></i>
            <span className="font-serif font-bold text-blend-dark">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-gray-400 hover:text-blend-cerulean"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
