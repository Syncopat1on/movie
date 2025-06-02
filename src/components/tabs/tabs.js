import React from "react";

import './tabs.css';

function Tabs() {
  return (
    <div className="tabs-container">
      <div className="tabs-search">Search</div>
      <div className="tabs-rated">Rated</div>
      <div className="tabs-rectangle"></div>
      <div className="tabs-rectangle--not-active"></div>
    </div>
  )
}

export default Tabs;