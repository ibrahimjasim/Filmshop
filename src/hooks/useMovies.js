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

export function useMovies({ searchText = '', genreId = null } = {}) {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true); // första laddningen
    const [loadingMore, setLoadingMore] = useState(false); // nästa sida laddas
    const [error, setError] = useState(null);
    const [reloadToken, setReloadToken] = useState(0); // ändras när vi vill ladda om

    // Sparar pågående anrop så att vi kan avbryta det om användaren
    const abortRef = useRef(null);

    const reload = useCallback(() => {
        setReloadToken((token) => token + 1);
    }, []);

    // Hämta sida 1 när sökord eller genre ändras
    useEffect(() => {
        abortRef.current?.abort(); // avbryt pågående anrop
        const controller = new AbortController();
        abortRef.current = controller;

        setLoading(true);
        setError(null);

        fetchPage({ searchText, genreId, page: 1, signal: controller.signal })
            .then((data) => {
                if (abortRef.current !== controller) return;

                let results = data.results ?? [];
                // Sökendpointen kan inte filtrera på genre, så när BÅDE sökord och
                // genre är valda filtrerar vi resultatet här i appen i stället.
                if (searchText && genreId) {
                    results = results.filter((movie) =>
                        (movie.genre_ids ?? movie.genreIds ?? []).includes(genreId)
                    );
                }
                setMovies(results);
                setPage(1);
                setTotalPages(data.totalPages ?? data.total_pages ?? 1);
            })
            .catch((err) => {
                if (abortRef.current !== controller) return;
                if (err.name !== 'AbortError') {
                    setError(err.message);
                    setMovies([]);
                    setTotalPages(1);
                }
            })
            .finally(() => {
                if (abortRef.current === controller) setLoading(false);
            });

        // Städfunktion: avbryt anropet om komponenten försvinner.
        return () => controller.abort();
    }, [searchText, genreId, reloadToken]);



return { movies, loading, loadingMore, error, loadMore, reload, hasMore: page < totalPages };
}
