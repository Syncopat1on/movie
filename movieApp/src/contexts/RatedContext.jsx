import React, { createContext, useState, useContext, useEffect } from 'react';

const RatedContext = createContext();

export function RatedProvider({ children }) {
    const [ratedMovies, setRatedMovies] = useState(() => {
        const saved = localStorage.getItem('ratedMovies');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('ratedMovies', JSON.stringify(ratedMovies));
    }, [ratedMovies]);

    const addRatedMovie = (movie, rating) => {
        setRatedMovies((prev) => {
            const existingIndex = prev.findIndex((m) => m.id === movie.id);
            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = { ...movie, userRating: rating };
                return updated;
            }
            return [...prev, { ...movie, userRating: rating }];
        });
    };

    return (
        <RatedContext.Provider value={{ ratedMovies, addRatedMovie }}>
            {children}
        </RatedContext.Provider>
    );
}

export function useRatedMovies() {
    return useContext(RatedContext);
}
