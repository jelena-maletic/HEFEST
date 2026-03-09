import React from 'react';
import ReactDOM from 'react-dom';
import './CenteredOverlay.css';

const CenteredOverlay = ({ isVisible, onClose, children, className}) => {
    if (!isVisible) return null;

    return ReactDOM.createPortal(
        <div className="centered-overlay-backdrop" onClick={onClose}>
            <div
                className={`centered-overlay-content-wrapper ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>,
        document.getElementById('modal-root') || document.body
    );
};

export default CenteredOverlay;