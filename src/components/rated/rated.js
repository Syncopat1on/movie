import React, { useState } from 'react';
import { useRatedMovies } from '../../contexts/RatedContext';
import MoviePoster from '../moviePoster/moviePoster';
import Description from '../description/description';
import Tabs from '../tabs/tabs';
import PaginationB from '../pagination/pagination'; 
import './rated.css';

const ITEMS_PER_PAGE = 6;

function Rated() {
  const { ratedMovies } = useRatedMovies();
  const [currentPage, setCurrentPage] = useState(1);

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

  return (
    <div className="rated-container">
      <Tabs />
      <div className='rated-movies'>
        {ratedMovies.length > 0 ? (
          <>
            <div className='card-container'>
              {currentMovies.map(movie => (
                <div className='movie-card' key={movie.id}>
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
              ))}
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