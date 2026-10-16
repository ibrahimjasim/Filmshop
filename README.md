# FilmShop

A mobile movie shop built with **React Native (Expo)**. Browse popular movies, search and filter by genre, open a movie for details, and buy it as a **digital copy, Blu-ray or poster**. The cart is saved on the phone, and checkout is a fake payment, so no real money is involved.

Movie data comes from **[The Movie Database (TMDb)](https://www.themoviedb.org/)**.

## Features

- **Catalog**: popular movies in a 2-column grid, with infinite scroll and pull-to-refresh
- **Search** with debounce (waits 500 ms after typing) and a **genre filter**. Search and genre can be combined
- **Detail screen**: backdrop, poster, rating, runtime, genres, overview and a format picker
- **Cart**: add and remove items and change quantities. A badge on the tab shows the number of items
- **Saved cart**: the cart is still there after you close and reopen the app
- **Fake checkout**: name and email validation, a "processing" state, and a thank-you screen with an order number
- **Loading and error states** everywhere, with a "Try again" button

## Tech stack

| What | Used for |
|---|---|
| [Expo](https://expo.dev/) SDK 57 + React Native | The app framework |
| [Expo Router](https://docs.expo.dev/router/introduction/) | File-based navigation: Stack, Tabs and a modal |
| [Redux Toolkit](https://redux-toolkit.js.org/) + React Redux | Global state for the cart |
| [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) | Saving the cart on the phone |
| [TMDb API](https://developer.themoviedb.org/docs) | Movie data and images |
| expo-image, @expo/vector-icons | Images and icons |

## Getting started

**You need:** [Node.js](https://nodejs.org/) (LTS), the **Expo Go** app on your phone, and a free **TMDb API key** (create an account on themoviedb.org → *Settings → API*).

```bash
# 1. Install dependencies
npm install

# 2. Add your TMDb key
cp .env.example .env.local
#    then open .env.local and paste your key after the =

# 3. Start the app
npx expo start
```

Scan the QR code with the camera (iOS) or with Expo Go (Android).

> If you change `.env.local`, restart with `npx expo start -c` so Expo picks up the new key.

## Project structure

```
src/
├── app/                    Screens. Every file is a screen (Expo Router)
│   ├── _layout.js          Root layout: Redux Provider + Stack navigator
│   ├── (tabs)/
│   │   ├── _layout.js      Tab bar: Shop and Cart (with badge)
│   │   ├── index.js        Catalog: search, genres, movie grid
│   │   └── cart.js         Cart: items, quantities, total
│   ├── movie/[id].js       Detail screen (/movie/550)
│   └── checkout.js         Fake checkout (opens as a modal)
├── api/tmdb.js             All communication with TMDb
├── hooks/                  useMovies, useGenres, useDebounce
├── components/             Reusable UI: MovieCard, GenreChips, CartItemRow, ...
├── store/                  Redux cart slice, store and AsyncStorage persistence
├── utils/pricing.js        Prices and price formatting
└── constants/theme.js      Colors and spacing
```

Each folder has one job: screens draw the UI, hooks hold the data logic, `api/` talks to TMDb, and `store/` holds the cart.

## How it works

- **Movies:** a screen calls the `useMovies` hook, which picks the right endpoint (popular, search or genre) and calls `api/tmdb.js`. All `fetch` calls, the API key and the error handling live in that one file.
- **Cart:** the cart is a Redux slice. Every screen reads it with `useSelector` and changes it with `dispatch`, so the catalog, the detail screen, the cart and the tab badge always show the same cart.
- **Saving:** at startup the saved cart is loaded from AsyncStorage. After that, `store.subscribe` saves it automatically every time it changes.
- **Prices:** TMDb has no prices, so the app uses its own: Digital 79 kr, Blu-ray 179 kr, Poster 149 kr. Movies released in the last year cost 30 kr extra.

## Scripts

| Command | What it does |
|---|---|
| `npm start` | Starts the Expo dev server |
| `npm run ios` / `npm run android` | Starts and opens a simulator or emulator |
| `npm run web` | Runs the app in the browser |

## Notes

- This is a **school project** (Folkuniversitetet). The checkout is a **demo**: no real payment is made and no data is sent anywhere.
- The TMDb key is kept in `.env.local`, which is git-ignored. Because `EXPO_PUBLIC_` variables are built into the app, a production app would call TMDb through its own server instead.
- This product uses the TMDb API but is not endorsed or certified by TMDb.
