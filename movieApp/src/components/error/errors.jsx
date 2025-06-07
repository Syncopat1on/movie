import React from 'react';

import { Alert } from 'antd';
import './error.css';

function Errors({ errorMessage, onRetry }) {
    return (
        <div className="error-container">
            <div className="error-card">
                <Alert message={errorMessage} type="error" showIcon />
                <p>Failed to load movies</p>
                <button className="retry-button" onClick={onRetry}>
                    Try Again
                </button>
            </div>
        </div>
    );
}

export default Errors;
