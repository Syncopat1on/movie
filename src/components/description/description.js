import React from 'react';

import './description.css';

function Description({movieTitle, movieRealiaseDate, movieOverview, truncateText}) {
  return (
    <div className='description'>
        <div className='description-title'>{movieTitle}</div>
            <div className='description-realise'>{movieRealiaseDate}</div>
            <div className='description-genre'>
                <div className='genre-card'>Drama</div>
                <div className='genre-card'>Anime</div>
            </div>
        <div className='description-text'>
          {movieOverview}
        </div>
    </div>
  );
}

export default Description;