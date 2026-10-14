// Root layout: runs first and wraps the WHOLE app.
// With Expo Router every file in src/app is a screen, and
// _layout.js decides which navigator the screens live in.

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store, setupCartPersistence } from '../store';
import { colors } from '../constants/theme';

export default function RootLayout() {
  // Load the saved cart once when the app starts.
  useEffect(() => {
    setupCartPersistence();
  }, []);

  return (
    // Provider makes the Redux store available to every screen below it.
    <Provider store={store}>
      <StatusBar style="light" />
      {/* Stack = screens are placed on top of each other with a "back" button */}
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        {/* (tabs) = the Shop + Cart tabs. The tabs have their own headers. */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Shop' }} />
        {/* Detail screen – [id] means the movie id is part of the address */}
        <Stack.Screen name="movie/[id]" options={{ title: '' }} />
        {/* Checkout is shown as a modal (slides up from the bottom) */}
        <Stack.Screen name="checkout" options={{ title: 'Checkout', presentation: 'modal' }} />
      </Stack>
    </Provider>
  );
}
