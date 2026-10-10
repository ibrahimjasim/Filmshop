import {useState, useEffect} from 'react';
import {getGenres} from '../api/tmdb';

/**
 * Hämtar genrelistan en gång när katalogen visas.*/

export function useGenres() {
    const [genres, setGenres] = useState([]);

    useEffect(()=> {
        const controller = new AbortController();
        getGenres(controller.signal)
            .then(setGenres)
            .catch(() => setGenres([]));
            return () => controller.abort();
    }, []); // Tom array = körs bara en gång
    return genres;
}