import React, { useContext } from 'react';
import './description.css';
import { Rate } from 'antd';
import { GenreContext } from '../../contexts/GenreContext';
import { useRatedMovies } from '../../contexts/RatedContext';

function getRatingColor(voteAverage) {
  const num = parseFloat(voteAverage);
  if (num >= 0 && num < 3) return '#E90000';
  if (num >= 3 && num < 5) return '#E97E00';
  if (num >= 5 && num < 7) return '#E9D100';
  if (num >= 7) return '#66E900';
  return '#000000';
}

function Description({ movie, movieTitle, movieRealiaseDate, movieOverview, voteAverage, genreIds }) {
  const ratingColor = getRatingColor(voteAverage);
  const { genres } = useContext(GenreContext);
  const { addRatedMovie } = useRatedMovies();

  const getGenreNames = () => {
    if (!genres || !genreIds) return [];
    return genreIds.map(id => {
      const genre = genres.find(g => g.id === id);
      return genre ? genre.name : 'Unknown';
    });
  };

  const displayOverview = movieOverview?.trim() ? movieOverview : 'No description';

  return (
    <div className='description'>
      <div 
        className='description-current_rating'
        style={{ borderColor: ratingColor }}
      >
        {voteAverage}
      </div>
      <div className='description-title'>{movieTitle}</div>
      <div className='description-realise'>{movieRealiaseDate}</div>
      <div className='description-genre'>
        {getGenreNames().map((name, index) => (
          <div key={index} className='genre-card'>{name}</div>
        ))}
      </div>
      <div className='description-text'>{displayOverview}</div>
      <div className='description-rate'>
        <Rate
          count={10}
          allowHalf
          value={movie.userRating || 0}
          onChange={(value) => addRatedMovie(movie, value)}
        />
      </div>
    </div>
  );
}

export default Description;