import React from 'react';

import './error.css';

function MovieNotFound({searchQuery}) {
  return (
      <div className='movieNotFound-container'>
        <div>No movies found for:<strong> "{searchQuery}"</strong></div>
      </div>
  );
}

export default MovieNotFound;