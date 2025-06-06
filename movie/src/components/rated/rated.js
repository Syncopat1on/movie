import React, { useState, useEffect, useContext} from 'react';

import MoviePoster from '../moviePoster/moviePoster';
import Description from '../description/description';
import Tabs from '../tabs/tabs';
import PaginationB from '../pagination/pagination';
import './rated.css';
import { Rate } from 'antd'; 
import { useRatedMovies } from '../../contexts/RatedContext';
import { GenreContext } from '../../contexts/GenreContext';

const ITEMS_PER_PAGE = 6;

function Rated() {
  const { ratedMovies, addRatedMovie } = useRatedMovies(); 
  const [currentPage, setCurrentPage] = useState(1);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { genres } = useContext(GenreContext);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(ratedMovies.length / ITEMS_PER_PAGE);
  const shouldShowPagination = ratedMovies.length > ITEMS_PER_PAGE;
  const currentMovies = ratedMovies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getRatingColor = (voteAverage) => {
    const num = parseFloat(voteAverage);
    if (num >= 0 && num < 3) return '#E90000';
    if (num >= 3 && num < 5) return '#E97E00';
    if (num >= 5 && num < 7) return '#E9D100';
    if (num >= 7) return '#66E900';
    return '#000000';
  };

  const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    let truncated = text.substr(0, maxLength);
    truncated = truncated.substr(0, truncated.lastIndexOf(' '));
    return truncated + ' ...';
  };

  const getGenreNames = (genreIds) => {
    if (!genres || !genreIds) return [];
    return genreIds.map(id => {
      const genre = genres.find(g => g.id === id);
      return genre ? genre.name : 'Unknown';
    });
  };
  const renderMobileCard = (movie) => {
    const ratingColor = getRatingColor(movie.vote_average);
    const genreNames = getGenreNames(movie.genre_ids);

    return (
      <div className='mobile-movie-card' key={movie.id}>
        <div className='mobile-card-content'>
          <div className='mobile-poster-wrapper'>
            <MoviePoster 
              posterPath={movie.poster_path} 
              title={movie.title} 
              mobileSize={true}
            />
          </div>
          <div className='mobile-info'>
            <div className='mobile-header'>
              <div className='mobile-title'>{movie.title}</div>
              <div 
                className='mobile-rating'
                style={{ borderColor: ratingColor }}
              >
                {movie.vote_average ? movie.vote_average.toFixed(1) : "0.0"}
              </div>
            </div>
            <div className='mobile-release_date'>{movie.release_date}</div>

            <div className='mobile-genres'>
              {genreNames.map((name, index) => (
                <div key={index} className='mobile-genre'>{name}</div>
              ))}
            </div>
          </div>
        </div>
        <div className='mobile-description'>
          {truncateText(movie.overview || 'No description', 150)}
        </div>
        <div className='mobile-rate'>
          <Rate 
            count={10}
            allowHalf
            value={movie.userRating || 0}
            onChange={(value) => addRatedMovie(movie, value)} 
          />
        </div>
      </div>
    );
  };

  const renderDesktopCard = (movie) => (
    <div className="movie-card" key={movie.id}>
      <MoviePoster posterPath={movie.poster_path} title={movie.title} />
      <Description
        movie={movie}
        movieTitle={movie.title}
        movieRealiaseDate={movie.release_date}
        movieOverview={movie.overview}
        voteAverage={movie.vote_average ? movie.vote_average.toFixed(1) : "0.0"}
        genreIds={movie.genre_ids}
      />
    </div>
  );

  return (
    <div className="rated-container">
      <Tabs />
      <div className="rated-movies">
        {ratedMovies.length > 0 ? (
          <>
            <div className="card-container">
              {currentMovies.map(movie =>
                windowWidth <= 500 ? renderMobileCard(movie) : renderDesktopCard(movie)
              )}
            </div>
            {shouldShowPagination && (
              <PaginationB
                currentPage={currentPage}
                totalPages={totalPages}
                onChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <div className="no-rated-movies">
            You haven't rated any movies yet
          </div>
        )}
      </div>
    </div>
  );
}

export default Rated;