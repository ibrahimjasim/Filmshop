// ─────────────────────────────────────────────────────────────
// TMDb-tjänsten: ALL kommunikation med The Movie Database sker här.
// ─────────────────────────────────────────────────────────────

const BASE_URL = `https://api.themoviedb.org/3`;
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const LANGUAGE = `sv-SE`; // svenska titlar och beskrivningar


const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;


const isBearerToken = (key) => typeof key === 'string' && key.length > 40;

export class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}


function messageForStatus(status) {
    switch (status) {
        case 401: return `Ogiltig API-nyckel.`;
        case 404: return `Hittade inte resursen.`;
        case 429: return `För många förfrågningar.`;
        default: 
        return status >= 500? 'TMDb har tekniska problem just nu. Försök igen senare.'
        : `Något gick fel (felkod ${status}).`;

    }
}
/**
    *Gemensam fetch-funktion som alla anrop går igenom.
    @param {string} path t..ex. "/movie/123"
    @param {object} options fetch-alternativ, t.ex. { method: 'POST' }
    @param {AbortSignal} signal optional AbortSignal för att avbryta anropet
 */
async function request(path, params = {}, signal) {
    if (!API_KEY) throw new ApiError(`Ingen TMDb API-nyckel satt i miljön.`, 401);

    // Bygg query-strängen
    const query = new URLSearchParams({ language: LANGUAGE, ...params });
    const headers = { accept: 'application/json' };
    if (isBearerToken(API_KEY)) {
        headers.Authorization = `Bearer ${API_KEY}`;
    } else {
        query.set('api_key', API_KEY);
    }

    let response;
    try {
        response = await fetch(`${BASE_URL}${path}?${query}`, { headers, signal });

    } catch (err) {
        // AbortError betyder att VI avbröt anropet – skicka vidare som det är.
        if (err?.name === 'AbortError') throw err;
        // Annars nådde vi aldrig servern
        throw new ApiError('Kunde inte nå TMDb. Kontrollera din internetanslutning.', 0);
    }

    if (!response.ok) {
        throw new ApiError(messageForStatus(response.status), response.status);
    }

    return response.json();
}

// Publika funktioner som skärmarna använder

/** Populära filmer – startsidans standardlista. */
export function getPopularMovies(page = 1, signal) {
    return request(`/movie/popular`, { page }, signal);
}

/** Sök efter filmer via en textsträng. */
export function searchMovies(searchText, page = 1, signal) {
    return request('/search/movie', { query: searchText,
        page, include_adult: 'false' }, signal);
    }
    
/** Filmer inom en viss genre (filtrering sker hos TMDb). */
export function getMoviesByGenre(genreId, page = 1, signal) {
    return request('/discover/movie', { with_genres:
        String(genreId), sort_by: 'popularity.desc',
        page, include_adult: 'false' }, signal);
    }

/** Lista över alla genrer, t.ex. [{ id: 28, name: "Action" }, ...] */
export async function getGenres(signal) {
    const data = await request('/genre/movie/list', {}, signal);
    return data.genres??[];
}

/**
 * Detaljer om en film. Om den svenska beskrivningen saknas
 * hämtar vi den engelska som reserv.
 */
export async function getMovieDetails(movieId, signal) {
    const movie = await request(`/movie/${movieId}`, {}, signal);
    if (!movie.overview) {
        try {
            const english = await request('/movie/${movieId}', { language: 'en-US' }, signal);
            movie.overview = english.overview;
        } catch {
            // Reservhämtningen är inte kritisk – vi visar filmen ändå.
         }
        }
    return movie;
}

/**
 * Bygger en komplett bild-URL.*/

export function imageUrl(path, size = 'w342') {
    return path ? `${IMAGE_BASE_URL}/${size}${path}` : null;
}