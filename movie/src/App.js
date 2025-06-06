import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Movie from './components/movie/movie';
import Rated from './components/rated/rated';
import { GenreProvider } from './contexts/GenreContext'; 
import { RatedProvider } from './contexts/RatedContext';

function App() {
  return (
  <RatedProvider>
    <GenreProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Movie />} />
          <Route path="/rated" element={<Rated />} />
        </Routes>
      </Router>
    </GenreProvider>
  </RatedProvider>
  );
}

export default App;