import React from 'react';

import { Spin } from 'antd';
import './search.css';

function Search({ searchQ, handleSC, isSearching }) {
  return (
    <form className="search-form">
      <input
        type="text"
        placeholder="Type to search..."
        suffix={isSearching ? <Spin size="small" /> : null}
        value={searchQ}
        onChange={handleSC}
        className="search-input"
      />
    </form>
  );
}

export default Search;