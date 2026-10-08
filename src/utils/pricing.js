//bestämmer vi själva vad varje produktformat kostar.
// Varje film kan köpas i tre format: digitalt, Blu-ray eller som affisch.

export const PRODUCT_FORMAT =[
    { id: 'digital', label: 'Digital' (HD), basePrice: 79 },
    { id: 'bluray', label: 'Blu-ray', basePrice: 179},
    { id: 'poster', label: 'Affisch 50x70', basePrice: 149 },
];

// Filmer som släppts det senaste året räknas som "nyheter" och kostar lite mer.
const NEW_RELEASE_SURCHARGE = 30;

/**
 * Returnerar true om filmen släpptes inom de senaste 365 dagarna.
 * releaseDate kommer från TMDb som en sträng, t.ex. "2026-03-14".
 */
export function isNewRelease(releaseDate, today = new Date()) {
    if (!releaseDate) return false;
    const release = new Date(releaseDate);
    if (Number.isNaN(release.getTime())) return false;
    const oneYearMs = 365 * 24 * 60 * 60 * 1000;
    return today - release < oneYearMs && today >= release;
}

/** Hittar ett format via dess id*/
export function getFormat(formatId) {
    return PRODUCT_FORMAT.find(f => f.id === formatId) ?? PRODUCT_FORMAT[0]; // default till första formatet
}
/** Formaterar ett belopp i svenska kronor, */
export function formatPrice(amount) {
 // Egen formatering i stället för Intl
 const rounded = Math.round(amount);
 const withSpaces = String(rounded).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return `${withSpaces} kr`;
}

/**
 * Gör om en film från TMDb till en "produkt" som kan läggas i kundvagnen.
 * Vi sparar bara det vi behöver visa i appen, inte hela TMDb-objektet.*/
export function createCartProduct(movie, formatId = `digital`)  {
    const format = getFormat(formatId);
    return {
        movieId: movie.id,
        title: movie.title,
        format: format.id,
        formatLabel: format.label,
        price: getPrice(movie, format.id),
    };
}