// The cart as a Redux Toolkit "slice"
import { createSelector, createSlice} from '@reduxjs/toolkit';

const initialState ={
    items: [], // [{ key, movieId, title, posterPath, format, formatLabel, price, quantity }]
    hydrated: false, // becomes true once the saved cart is loaded from AsyncStorage
};

/**
 * Unique key per row. The same movie in two formats (e.g. Blu-ray and poster)
 * becomes two different rows in the cart.
 */
export const makeCartKey = (movieId, formatId) => `${movieId}-${formatId}`;

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            const product = action.payload;
            const key = makeCartKey(product.movieId, product.format);
            const existing = state.items.find((item)=> item.key === key);

            if (existing) {
                existing.quantity +=1; // already in the cart -> increase the quantity
            
            } else {
                state.items.push({...product, key, quantity: 1});
            }
        },

        removeFromCart(state, action) {
            const key = action.payload;
            state.items = state.items.filter((item)=> item.key !== key);

        },

        increaseQuantity(state,action) {
            const item = state.items.find((i) => i.key === action.payload);
            if (item) item.quantity += 1;
        },

        decreaseQuantity(state, action) {
            const item = state.items.find((i) => i.key === action.payload);
            if (!item) return;
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                // Quantity 1 -> 0 means the row should be removed completely.
                state.items = state.items.filter((i) => i.key !== action.payload);
            }
        },

        // Runs after the "payment" in the checkout.
       clearCart(state) {
      state.items = [];
    },

    // Runs ONCE when the app starts and the saved data has been loaded.
    hydraCart(state, action) {
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.hydrated = true;
     },

  },
});

// Action creators - dispatch
export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  hydrateCart,
} = cartSlice.actions;

export default cartSlice.reducer; 

// ── Selectors: ready-made "questions" to the cart ──
export const selectCartItems = (state) => state.cart.items;
export const selectCartHydrated = (state) => state.cart.hydrated;

// createSelector memoizes (remembers) the result. The sum is only recalculated
// when items actually change – not on every render.

export const selectCartCount = createSelector([selectCartItems], (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0)
);

export const selectCartTotal = createSelector([selectCartItems], (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

/** How many copies of a specific movie (all formats) are in the cart. */
export const selectQuantityForMovie = (state, movieId) =>
  state.cart.items
    .filter((item) => item.movieId === movieId)
    .reduce((sum, item) => sum + item.quantity, 0);