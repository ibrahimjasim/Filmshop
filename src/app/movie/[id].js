// DETAIL SCREEN : more info about ONE movie + buy section.

import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { getMovieDetails, imageUrl } from '../../api/tmdb';
import {
  addToCart,
  decreaseQuantity,
  makeCartKey,
  removeFromCart,
  selectCartItems,
} from '../../store/cartSlice';
import { createCartProduct, formatPrice, getPrice, PRODUCT_FORMATS } from '../../utils/pricing';
import PrimaryButton from '../../components/PrimaryButton';
import { ErrorView, LoadingView } from '../../components/StatusViews';
import { colors, radius, spacing } from '../../constants/theme';

/** 142 minutes -> "2 h 22 min" */
function formatRunTime(minutes) {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h} h ${m} min` : `${m} min`;
}

export default function MovieDetailScreen() {
  // id comes from the URL as a string, e.g. "550"
  const { id } = useLocalSearchParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('digital');
  const [attempt, setAttempt] = useState(0); // increased by "Try again"

  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  // ── Fetch the movie details when id changes ──
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    getMovieDetails(id, controller.signal)
      .then(setMovie)
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [id, attempt]);

  if (loading) return <LoadingView message="Loading movie details..." />;
  if (error) return <ErrorView message={error} onRetry={() => setAttempt((a) => a + 1)} />;
  if (!movie) return null;

  // ── Derived values (calculated on every render, no extra state needed) ──
  const cartKey = makeCartKey(movie.id, selectedFormat);
  const inCart = cartItems.find((item) => item.key === cartKey);

  const price = getPrice(movie, selectedFormat);
  const year = movie.release_date?.slice(0, 4);
  const runtime = formatRunTime(movie.runtime);
  const backdrop = imageUrl(movie.backdrop_path, 'w780');
  const poster = imageUrl(movie.poster_path, 'w342');

  return (
    <>
      {/* Sets the header title to the movie's title */}
      <Stack.Screen options={{ title: movie.title }} />

      <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: spacing.xl * 2 }}>
        {backdrop && <Image source={backdrop} style={styles.backdrop} contentFit="cover" />}

        {/* Without a backdrop the poster should not be pulled up over the edge */}
        <View style={[styles.header, !backdrop && { marginTop: 0 }]}>
          {poster && <Image source={poster} style={styles.poster} contentFit="cover" />}
          <View style={{ flex: 1, gap: spacing.xs }}>
            <Text style={[styles.title, !backdrop && { marginTop: 0 }]}>{movie.title}</Text>
            {movie.tagline ? <Text style={styles.tagline}>&quot;{movie.tagline}&quot;</Text> : null}
            <Text style={styles.meta}>{[year, runtime].filter(Boolean).join(' · ')}</Text>
            <View style={styles.rating}>
              <Ionicons name="star" size={16} color={colors.accent} />
              <Text style={styles.ratingText}>
                {movie.vote_average?.toFixed(1)} / 10 ({movie.vote_count} votes)
              </Text>
            </View>
          </View>
        </View>

        {/* Genres */}
        <View style={styles.genres}>
          {movie.genres?.map((g) => (
            <View key={g.id} style={styles.genreTag}>
              <Text style={styles.genreText}>{g.name}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.overview}>{movie.overview || 'There is no description for this movie.'}</Text>

        {/* ── Buy section ── */}
        <Text style={styles.sectionTitle}>Choose format</Text>
        <View style={styles.formats}>
          {PRODUCT_FORMATS.map((format) => {
            const active = format.id === selectedFormat;
            return (
              <Pressable
                key={format.id}
                onPress={() => setSelectedFormat(format.id)}
                style={[styles.formatOption, active && styles.formatActive]}
                accessibilityRole="radio"
                accessibilityState={{ checked: active }}
              >
                <Text style={[styles.formatLabel, active && { color: colors.accentText }]}>{format.label}</Text>
                <Text style={[styles.formatPrice, active && { color: colors.accentText }]}>
                  {formatPrice(getPrice(movie, format.id))}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.buyBox}>
          <Text style={styles.bigPrice}>{formatPrice(price)}</Text>

          {/* add AND remove from the detail screen */}
          {inCart ? (
            <View style={{ gap: spacing.sm }}>
              <Text style={styles.inCartText}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} /> {inCart.quantity} in your cart
              </Text>
              <View style={styles.row}>
                <PrimaryButton
                  title="−1"
                  variant="outline"
                  style={{ flex: 1 }}
                  onPress={() => dispatch(decreaseQuantity(cartKey))}
                />
                <PrimaryButton
                  title="+1"
                  style={{ flex: 1 }}
                  onPress={() => dispatch(addToCart(createCartProduct(movie, selectedFormat)))}
                />
              </View>
              <PrimaryButton
                title="Remove from cart"
                variant="outline"
                onPress={() => dispatch(removeFromCart(cartKey))}
              />
              <PrimaryButton title="Go to cart" onPress={() => router.navigate('/cart')} />
            </View>
          ) : (
            <PrimaryButton
              title="Add to cart"
              onPress={() => dispatch(addToCart(createCartProduct(movie, selectedFormat)))}
            />
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  backdrop: { width: '100%', aspectRatio: 16 / 9, opacity: 0.6 },
  header: { flexDirection: 'row', gap: spacing.lg, padding: spacing.lg, marginTop: -60 },
  poster: { width: 110, aspectRatio: 2 / 3, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border },
  title: { color: colors.text, fontSize: 22, fontWeight: '800', marginTop: 56 },
  tagline: { color: colors.textMuted, fontStyle: 'italic' },
  meta: { color: colors.textMuted },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { color: colors.text },
  genres: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, paddingHorizontal: spacing.lg },
  genreTag: { backgroundColor: colors.surfaceLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.lg },
  genreText: { color: colors.text, fontSize: 13 },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  overview: { color: colors.text, lineHeight: 22, paddingHorizontal: spacing.lg, opacity: 0.9 },
  formats: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg },
  formatOption: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 2,
  },
  formatActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  formatLabel: { color: colors.text, fontWeight: '600', fontSize: 13, textAlign: 'center' },
  formatPrice: { color: colors.textMuted, fontSize: 13 },
  buyBox: { margin: spacing.lg, padding: spacing.lg, backgroundColor: colors.surface, borderRadius: radius.lg, gap: spacing.md },
  bigPrice: { color: colors.accent, fontSize: 28, fontWeight: '800' },
  inCartText: { color: colors.success, fontWeight: '600' },
  row: { flexDirection: 'row', gap: spacing.sm },
});
