// Custom hook som hämtar filmlistan till katalogvyn.

import { useState, useEffect, useRef, useCallback } from 'react';
import {
    getPopularMovies,
    getMoviesByGenre,
    searchMovies,
} from '../api/tmdb';

function fetchPage({ searchText, genreId, page, signal }) {
    if (searchText) return searchMovies(searchText, page, signal);
    if (genreId) return getMoviesByGenre(genreId, page, signal);
    return getPopularMovies(page, signal);
}
