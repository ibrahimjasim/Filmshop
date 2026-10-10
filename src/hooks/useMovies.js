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

/** Tar bort dubbletter – TMDb kan returnera samma film på två sidor. */
function mergeUnique(existing, incoming) {
    const seen = new Set(existing.map((movie) => movie.id));
    return [...existing, ...incoming.filter((movie) => !seen.has(movie.id))];
}
