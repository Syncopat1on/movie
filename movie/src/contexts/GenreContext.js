import React, { createContext, useState, useEffect } from 'react';

export const GenreContext = createContext();

export const GenreProvider = ({ children }) => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=b492ca6569107b4ed4bb1f7fdd48db72')
      .then(res => res.json())
      .then(data => {
        if (data && data.genres) {
          setGenres(data.genres);
        }
      })
      .catch(err => console.error('Ошибка загрузки жанров:', err));
  }, []);

  return (
    <GenreContext.Provider value={{ genres }}>
      {children}
    </GenreContext.Provider>
  );
};