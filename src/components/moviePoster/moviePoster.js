import React, { useState } from 'react';

import Loading from '../loading/loading';
import fallbackImage from '../assets/fallbackImage.jpg'; 
import './moviePoster.css';

const MoviePoster = ({ posterPath, title }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageUrl = posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}` 
    : fallbackImage;

  return (
    <div className='poster-container'>
      {!isImageLoaded && !imageError && (
        <div className='loading-overlay'>
          <Loading />
        </div>
      )}

      {imageError ? (
        <img
          src={fallbackImage}
          alt='Image not found'
          className='movieImg'
          onLoad={() => setIsImageLoaded(true)}
        />
      ) : (
        <img
          src={imageUrl}
          alt={title}
          className='movieImg'
          onLoad={() => setIsImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setIsImageLoaded(true);
          }}
        />
      )}
    </div>
  );
};

export default MoviePoster;