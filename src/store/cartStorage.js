// Data persistence,the cart is saved in AsyncStorage.
// AsyncStorage is React Native's version of localStorage in the
// browser – a simple key/value storage on the phone.
// The difference: it's asynchronous, so we use async/await.


import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = '@filmshop/cart';


/** Reads the saved cart. Returns [] if nothing is saved or if the data is broken. */

export async function loadCart() {
    try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (!json) return [];
        const items = JSON.parse(json);
        return Array.isArray(items) ? items : [];
    } catch (err) {
        // Broken data should never crash the app – just start with an empty cart.
        console.warn('Could not read the saved cart:', err);
        return [];
    }
}

/** Saves the cart. AsyncStorage can only store text, so I use JSON.stringify. */

export async function saveCart(items) {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));

    } catch (err) {
        console.warn('Could not save the cart:', err);
    }
    
}

