import React, {
    useEffect,
    useState,
    useCallback,
    useContext,
    useRef,
} from 'react';

import './mobile-movie-card.css';
import './movie.css';
import MoviePoster from '../moviePoster/moviePoster';
import Errors from '../error/errors';
import MovieNotFound from '../error/movieNotFound';
import Description from '../description/description';
import Search from '../search/search';
import Loading from '../loading/loading';
import PaginationB from '../pagination/pagination';
import Tabs from '../tabs/tabs';
import { useRatedMovies } from '../../contexts/RatedContext';
import { Rate } from 'antd';
import { GenreContext } from '../../contexts/GenreContext';

function Movie() {
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const { ratedMovies, addRatedMovie } = useRatedMovies();
    const { genres } = useContext(GenreContext);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setError(null);
        };
        const handleOffline = () => {
            setIsOnline(false);
            setError('You are offline. Please check your internet connection.');
        };
        const handleResize = () => setWindowWidth(window.innerWidth);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const getRatingColor = (voteAverage) => {
        const num = parseFloat(voteAverage);
        if (num >= 0 && num < 3) return '#E90000';
        if (num >= 3 && num < 5) return '#E97E00';
        if (num >= 5 && num < 7) return '#E9D100';
        if (num >= 7) return '#66E900';
        return '#000000';
    };

    const getGenreNames = (genreIds) => {
        if (!genres || !genreIds) return [];
        return genreIds.map((id) => {
            const genre = genres.find((g) => g.id === id);
            return genre ? genre.name : 'Unknown';
        });
    };

    const searchMovies = useCallback(
        (query, page = 1) => {
            if (!isOnline) {
                setError('You are offline. Cannot search movies.');
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            const url = query
                ? `https://api.themoviedb.org/3/search/movie?api_key=b492ca6569107b4ed4bb1f7fdd48db72&query=${encodeURIComponent(query)}&page=${page}`
                : `https://api.themoviedb.org/3/discover/movie?api_key=b492ca6569107b4ed4bb1f7fdd48db72&page=${page}`;

            fetch(url)
                .then((res) => {
                    if (!res.ok)
                        throw new Error(`HTTP error! Status: ${res.status}`);
                    return res.json();
                })
                .then((json) => {
                    if (!json.results) throw new Error('Invalid data format');
                    const mergedResults = json.results.map((movie) => {
                        const ratedMovie = ratedMovies.find(
                            (m) => m.id === movie.id
                        );
                        return ratedMovie
                            ? { ...movie, userRating: ratedMovie.userRating }
                            : movie;
                    });
                    setFilteredMovies(mergedResults.slice(0, 6));
                    setTotalPages(Math.min(json.total_pages, 500));
                    setCurrentPage(page);
                })
                .catch((err) => {
                    console.error('Error:', err);
                    setError(err.message);
                    setFilteredMovies([]);
                })
                .finally(() => setIsLoading(false));
        },
        [isOnline, ratedMovies]
    );

    const handlePageChange = (page) => {
        if (!isOnline) {
            setError('Cannot change page while offline');
            return;
        }
        searchMovies(searchQuery, page);
    };

    const truncateText = (text, maxLength) => {
        if (!text || text.length <= maxLength) return text;
        let truncated = text.substr(0, maxLength);
        truncated = truncated.substr(0, truncated.lastIndexOf(' '));
        return truncated + ' ...';
    };

    const searchTimeout = useRef(null);

    const handleSearchChange = useCallback(
        (e) => {
            const query = e.target.value;
            setSearchQuery(query);

            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
            }

            searchTimeout.current = setTimeout(() => {
                searchMovies(query);
            }, 500);
        },
        [searchMovies]
    );

    useEffect(() => {
        searchMovies('');

        return () => {
            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
            }
        };
    }, [searchMovies]);

    const renderMobileCard = (movie) => {
        const ratingColor = getRatingColor(movie.vote_average);
        const genreNames = getGenreNames(movie.genre_ids);

        return (
            <div className="mobile-movie-card" key={movie.id}>
                <div className="mobile-card-content">
                    <div className="mobile-poster-wrapper">
                        <MoviePoster
                            posterPath={movie.poster_path}
                            title={movie.title}
                            mobileSize={true}
                        />
                    </div>
                    <div className="mobile-info">
                        <div className="mobile-header">
                            <div className="mobile-title">{movie.title}</div>
                            <div
                                className="mobile-rating"
                                style={{ borderColor: ratingColor }}
                            >
                                {movie.vote_average
                                    ? movie.vote_average.toFixed(1)
                                    : '0.0'}
                            </div>
                        </div>
                        <div className="mobile-release_date">
                            {movie.release_date}
                        </div>
                        <div className="mobile-genres">
                            {genreNames.map((name, index) => (
                                <div key={index} className="mobile-genre">
                                    {name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mobile-description">
                    {truncateText(movie.overview || 'No description', 150)}
                </div>
                <div className="mobile-rate">
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
                movieOverview={truncateText(movie.overview, 150)}
                voteAverage={
                    movie.vote_average ? movie.vote_average.toFixed(1) : '0.0'
                }
                genreIds={movie.genre_ids}
            />
        </div>
    );

    const renderMovieCards = () => {
        return filteredMovies.map((movie) =>
            windowWidth <= 500
                ? renderMobileCard(movie)
                : renderDesktopCard(movie)
        );
    };

    if (!isOnline && !filteredMovies.length) {
        return (
            <div className="movie-container">
                <Tabs />
                <Errors
                    errorMessage="You are offline. Please check your internet connection."
                    onRetry={() => window.location.reload()}
                />
            </div>
        );
    }

    if (isLoading && !filteredMovies.length) {
        return (
            <h2 className="loading">
                Loading...
                <Loading />
            </h2>
        );
    }

    if (error) {
        return (
            <Errors
                errorMessage={error}
                onRetry={() => searchMovies(searchQuery)}
            />
        );
    }

    if (filteredMovies.length === 0 && !isLoading && !error) {
        return (
            <div className="movie-container">
                <Tabs />
                <div className="search-container">
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
        <div className="movie-container">
            <Tabs />
            <div className="search-container">
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

            <div className="card-container">{renderMovieCards()}</div>

            <PaginationB
                currentPage={currentPage}
                totalPages={totalPages}
                onChange={handlePageChange}
                disabled={isLoading || !isOnline}
            />
        </div>
    );
}

export default Movie;
