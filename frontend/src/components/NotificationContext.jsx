import React, { createContext, useState, useContext } from "react";
import NotificationAlert from "../components/NotificationAlert";
import { ALERT_TYPES } from "../constants/alertTypes";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    const showNotification = (type, message, description) => {
        setNotification({ type, message, description });

        setTimeout(() => {
            setNotification(null);
        }, 5000);
    };

    const notify = {
        success: (message, description) =>
            showNotification(ALERT_TYPES.SUCCESS, message, description),

        error: (message, description) =>
            showNotification(ALERT_TYPES.ERROR, message, description),

        warning: (message, description) =>
            showNotification(ALERT_TYPES.WARNING, message, description),

        info: (message, description) =>
            showNotification(ALERT_TYPES.INFORMATION, message, description),
    };

    return (
        <NotificationContext.Provider value={notify}>
            {children}

            {notification && (
                <NotificationAlert
                    type={notification.type}
                    message={notification.message}
                    description={notification.description}
                    onClose={() => setNotification(null)}
                />
            )}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);