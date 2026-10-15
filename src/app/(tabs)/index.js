// CATALOG SCREEN -  list of movies + search field + genre filter.

import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useDebounce } from '../../hooks/useDebounce';
import { useGenres } from '../../hooks/useGenres';
import { useMovies } from '../../hooks/useMovies';
import { addToCart, selectCartItems } from '../../store/cartSlice';
import { createCartProduct } from '../../utils/pricing';
import MovieCard from '../../components/MovieCard';
import GenreChips from '../../components/GenreChips';
import { EmptyView, ErrorView, LoadingView } from '../../components/StatusViews';
import { colors, radius, spacing } from '../../constants/theme';

export default function CatalogScreen() {
    // ── Local state: only used on this screen ──
    const [searchText, setSearchText] = useState('');
    const [genreId, setGenreId] = useState(null);


    // Wait 500 ms after the last keypress before searching.
    const debouncedSearch = useDebounce(searchText.trim(), 500);


    // ── Data from the API via our custom hooks ──

    const genres = useGenres();
    const { movies, loading, loadingMore, error, loadMore, reload } = useMovies({
        searchText: debouncedSearch,
        genreId,
    });


    // ── Global state from Redux ──
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);


    // Build a lookup table { movieId: quantity } once per cart change,
    // instead of every card searching through the whole cart.
    const quantityByMovie = useMemo(() => {
        const map = {};
        for (const item of cartItems) {
            map[item.movieId] = (map[item.movieId] ?? 0) + item.quantity;
        }

        return map;
    }, [cartItems]);

    // useCallback: same function reference between renders -> memo in MovieCard works.
    const openMovie = useCallback((movie) => {
        // Navigate to the detail screen. The URL becomes
        router.push({ pathname: '/movie/[id]', params: { id: String(movie.id) } });

    }, []);

    const quickAdd = useCallback(
        (movie) => dispatch(addToCart(createCartProduct(movie, 'digital'))),
        [dispatch]
    );

    // ── What should the list area show? ──
    function renderListBody() {
        if (loading) return <LoadingView message="Loading movies..." />;
        if (error && movies.length === 0) return <ErrorView message={error} onRetry={reload} />;
        if (movies.length === 0) {
            return (
                <EmptyView
                    icon="search-outline"
                    title="No results"
                    message={debouncedSearch ? `We found no movies for "${debouncedSearch}".` : 'No movies in this genre.'}
                />);
        }

        return (
            <FlatList
                data={movies}
                keyExtractor={(movie) => String(movie.id)} // stable key from the database, never the index

                numColumns={2}
                columnWrapperStyle={styles.columns}
                contentContainerStyle={styles.list}
                keyboardDismissMode="on-drag"
                renderItem={({ item }) => (
                    <MovieCard
                        movie={item}
                        quantityInCart={quantityByMovie[item.id] ?? 0}
                        onPress={openMovie}
                        onQuickAdd={quickAdd}
                    />
                )}
                // Infinite scroll: fetch the next page when we're 50% from the bottom
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    loadingMore ? <ActivityIndicator style={{ margin: spacing.lg }} color={colors.accent} /> : null
                }
                refreshControl={<RefreshControl refreshing={false} onRefresh={reload} tintColor={colors.accent} />}
            />
        );
    }

    return (
        <View style={styles.screen}>
                  {/* Search field */}
                  <View style={styles.searchBox}>
                    <Ionicons name="search" size={18} color={colors.textMuted} />
                    <TextInput 
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholder="Search movie.."
                    placeholderTextColor={colors.textMuted}
                    style={styles.searchInput}
                    returnKeyType="search"
                    autoCorrect={false}/>
                    {searchText.length > 0 && (
                        <Pressable onPress={() => setSearchText('')} hitSlop={10} accessibilityLabel="Clear search">
                            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                        </Pressable>
                    )}

                  </View>

                  {/* Genre filter */}
                  {genres.length > 0 && <GenreChips genres={genres} selectedId={genreId} onSelect= {setGenreId} />}

                  <View style={{flex: 1}} >{renderListBody()}</View>

        </View>
    );
}

const styles = StyleSheet.create({
   screen: { flex: 1, backgroundColor: colors.background },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: { flex: 1, color: colors.text, fontSize: 16, paddingVertical: spacing.md },
  list: { padding: spacing.lg, gap: spacing.md },
  columns: { gap: spacing.md },
});