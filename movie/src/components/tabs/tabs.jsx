import React from 'react';

import { useNavigate, useMatch } from 'react-router-dom';
import './tabs.css';

function Tabs() {
    const navigate = useNavigate();
    const isHome = useMatch('/');
    const isRated = useMatch('/rated');

    return (
        <div className="tabs-container">
            <div
                className={`tabs-search ${isHome ? 'active' : ''}`}
                onClick={() => navigate('/')}
            >
                Search
            </div>

            <div
                className={`tabs-rated ${isRated ? 'active' : ''}`}
                onClick={() => navigate('/rated')}
            >
                Rated
            </div>

            <div
                className={`tabs-rectangle ${isHome ? 'active' : 'not-active'}`}
            ></div>
            <div
                className={`tabs-rectangle ${isHome ? 'active' : 'not-active'}`}
            ></div>
        </div>
    );
}

export default Tabs;
