import React from 'react';
import ReactDOM from 'react-dom';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import './ConfirmationDialog.css';

const ConfirmationDialog = ({
                                title,
                                message,
                                confirmText = 'Delete',
                                cancelText = 'Cancel',
                                onConfirm,
                                onCancel,
                                isVisible,
                                icon = <ExclamationCircleOutlined />,
                                iconColor = '#ff4d4f',
                            }) => {
    if (!isVisible) return null;

    return ReactDOM.createPortal(
        <div className="confirmation-dialog-overlay">
            <div className="confirmation-dialog-content">
                <div className="confirmation-dialog-icon" style={{ color: iconColor }}>
                    {icon}
                </div>

                <div className="confirmation-dialog-text">
                    <h3 className="confirmation-dialog-title">{title}</h3>
                    <p className="confirmation-dialog-message">{message}</p>
                </div>

                <div className="confirmation-dialog-actions">
                    <button
                        className="dialog-button dialog-button-cancel"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>
                    <button
                        className="dialog-button dialog-button-confirm"
                        onClick={onConfirm}
                        style={{ backgroundColor: iconColor }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById('modal-root') || document.body
    );
};

export default ConfirmationDialog;