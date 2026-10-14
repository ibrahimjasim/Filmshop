//  The Redux store: the app's global "database" in memory.
import { configureStore } from "@reduxjs/toolkit";
import cartReducer, {hydrateCart} from './cartSlice';
import {loadCart, saveCart} from './cartStorage'

export const store = configureStore({
    reducer: {
        cart: cartReducer, // state.cart = the part handled by cartSlice
    },
});

export async function setupCartPersistence() {
    const savedItems = await loadCart();
    store.dispatch(hydrateCart(savedItems));

    let previousItems = store.getState().cart.items;

     // subscribe runs after EVERY dispatch in the whole app.
     store.subscribe(() => {
        const {items, hydrated} = store.getState().cart;

        //Immer will only get a new array reference when items actually
        // changed. So a quick !== comparison is enough to avoid unnecessary writes.
        // "hydrated" stops an empty cart from overwriting saved data before loading is done.

        if (hydrated && items !== previousItems) {
            previousItems = items;
            saveCart(items);
        }


     })
    
}