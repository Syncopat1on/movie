import React, { useEffect, useState, useCallback } from 'react';

import './movie.css';
import MoviePoster from '../moviePoster/moviePoster';
import Errors from '../error/errors';
import MovieNotFound from '../error/movieNotFound';
import Description from '../description/description';
import Search from '../search/search';
import Tabs from '../tabs/tabs';
import Loading from '../loading/loading';
import PaginationB from '../pagination/pagination';

import { debounce } from 'lodash';

function Movie() {
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const searchMovies = useCallback((query, page = 1) => {
    setIsLoading(true);
    setError(null);

    const url = query
      ? `https://api.themoviedb.org/3/search/movie?api_key=b492ca6569107b4ed4bb1f7fdd48db72&query=${encodeURIComponent(query)}&page=${page}`
      : `https://api.themoviedb.org/3/discover/movie?api_key=b492ca6569107b4ed4bb1f7fdd48db72&page=${page}`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then(json => {
        if (!json.results) throw new Error('Invalid data format');

        const limitedResults = json.results.slice(0, 6);
        setFilteredMovies(limitedResults);
        setTotalPages(Math.min(json.total_pages, 500))
        setCurrentPage(page);
      })
      .catch(err => {
        console.error('Error:', err);
        setError(err.message);
        setFilteredMovies([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const debouncedSearch = useCallback(
    debounce((query) => {
      searchMovies(query);
    }, 500),
    [searchMovies]
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0 && query.length < 1) return;

    debouncedSearch(query);
  };

  const handlePageChange = (page) => {
    searchMovies(searchQuery, page);
  };

  const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    let truncated = text.substr(0, maxLength);
    truncated = truncated.substr(0, truncated.lastIndexOf(' '));
    return truncated + ' ...';
  };

  useEffect(() => {
    searchMovies('');

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchMovies]);

  if (isLoading && !filteredMovies.length) {
    return (
      <h2 className="loading">
        Loading...
        <Loading />
      </h2>
    );
  }

  if (error) {
    return <Errors errorMessage={error} onRetry={() => searchMovies(searchQuery)} />;
  }

  if (filteredMovies.length === 0 && !isLoading && !error) {
    return (
      <div className='movie-container'>
        <Tabs />
        <div className='search-container'>
          <Search 
            searchQ={searchQuery} 
            handleSC={handleSearchChange} 
            isSearching={isLoading}
          />
        </div>
        <MovieNotFound searchQuery={searchQuery} />
      </div>
    );
  }

  return (
    <div className='movie-container'>
      <Tabs />
      <div className='search-container'>
        <Search 
          searchQ={searchQuery} 
          handleSC={handleSearchChange} 
          isSearching={isLoading}
        />
      </div>

      {isLoading && (
      <h2 className="loading">
        Loading...
        <Loading />
      </h2>
    )}

      <div className='card-container'>
        {filteredMovies.map((movie) => (
          <div className='movie-card' key={movie.id}>
            <MoviePoster 
              posterPath={movie.poster_path} 
              title={movie.title}
            />
            <Description 
              movieTitle={movie.title} 
              movieRealiaseDate={movie.release_date}
              movieOverview={truncateText(movie.overview, 150)} 
            />
          </div>
        ))}
      </div>
        <PaginationB 
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={handlePageChange}
          disabled={isLoading}
        />
    </div>
  );
}

export default Movie;