import React, { createContext, useContext, useState, useEffect } from 'react';

export const NotificationContext = createContext();

const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      ...styles.notification,
      ...(type === 'error' ? styles.error : styles.success)
    }}>
      {message}
    </div>
  );
};

const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({ show: false, message: '', type: 'error' });

  const showNotification = (message, type = 'error') => {
    setNotification({ show: true, message, type });
  };

  const hideNotification = () => {
    setNotification({ ...notification, show: false });
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}
      {children}
    </NotificationContext.Provider>
  );
};

export { useNotification };
export default NotificationProvider;

const styles = {
  notification: {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '1rem 2rem',
    borderRadius: '4px',
    color: '#000',
    zIndex: 1000,
    animation: 'slideIn 0.3s ease-out',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    minWidth: '200px',
    textAlign: 'center',
  },
  error: {
    backgroundColor: '#f8f9fa',
  },
  success: {
    backgroundColor: '#f8f9fa',
  },
  '@keyframes slideIn': {
    from: {
      transform: 'translate(-50%, -100%)',
      opacity: 0,
    },
    to: {
      transform: 'translate(-50%, 0)',
      opacity: 1,
    },
  },
};
