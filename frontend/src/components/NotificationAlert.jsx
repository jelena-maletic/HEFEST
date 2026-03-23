import React from 'react';
import { ALERT_TYPES } from '../constants/alertTypes';
import { InfoCircleOutlined, CheckCircleOutlined, WarningOutlined, CloseCircleOutlined } from '@ant-design/icons';
import './NotificationAlert.css';

const CONFIG_MAP = {
    [ALERT_TYPES.INFORMATION]: { color: '#4096ff', icon: <InfoCircleOutlined /> },
    [ALERT_TYPES.SUCCESS]: { color: '#52c41a', icon: <CheckCircleOutlined /> },
    [ALERT_TYPES.WARNING]: { color: '#faad14', icon: <WarningOutlined /> },
    [ALERT_TYPES.ERROR]: { color: '#ff4d4f', icon: <CloseCircleOutlined /> },
};

const NotificationAlert = ({
                               type = ALERT_TYPES.INFORMATION,
                               message,
                               description,
                               onClose,
                           }) => {
    const config = CONFIG_MAP[type] || CONFIG_MAP[ALERT_TYPES.INFORMATION];
    const IconComponent = config.icon;

    return (
        <div
            className={`notification-alert ${type}`}
            style={{ '--alert-color': config.color }}
        >
            <div className="notification-icon-wrapper">
                <div className="notification-icon" style={{ color: config.color }}>
                    {IconComponent}
                </div>
            </div>

            <div className="notification-content">
                <div className="notification-message">
                    {message}
                </div>
                <div className="notification-description">
                    {description}
                </div>
            </div>

            {onClose && (
                <button onClick={onClose} className="notification-close-btn">
                    &times;
                </button>
            )}
        </div>
    );
};

export default NotificationAlert;