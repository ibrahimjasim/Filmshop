//  The Redux store: the app's global "database" in memory.
import { configureStore } from "@reduxjs/toolkit";
import cartReducer, {hydrateCart} from './cartSlice';
import {loadCart, saveCart} from './cartStorage'

export const store = configureStore({
    reducer: {
        cart: cartReducer, // state.cart = the part handled by cartSlice
    },
});