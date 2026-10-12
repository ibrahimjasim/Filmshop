// Ett kort i katalogens rutnät: affisch, titel, betyg, pris och snabbköp.
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { imageUrl } from '../api/tmdb';
import { formatPrice, getPrice, isNewRelease } from '../utils/pricing';
import { colors, radius, spacing } from '../constants/theme';

// onPress/onQuickAdd tar emot filmen som argument. Då kan föräldern skicka
// SAMMA funktion till alla kort, vilket gör att memo() nedan fungerar.
function MovieCard({ movie, quantityInCart, onPress, onQuickAdd }) {
  const poster = imageUrl(movie.poster_path, 'w342');
  const year = movie.release_date?.slice(0, 4);

  return (
    <Pressable onPress={() => onPress(movie)} style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}>
      <View>
        {poster ? (
          <Image source={poster} style={styles.poster} contentFit="cover" transition={200} />
        ) : (
          // Alla filmer har inte en affisch – visa en platshållare.
          <View style={[styles.poster, styles.placeholder]}>
            <Ionicons name="film-outline" size={40} color={colors.textMuted} />
          </View>
        )}

        {isNewRelease(movie.release_date) && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>New films</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={styles.meta}>
          {year || '—'} · ★ {movie.vote_average ? movie.vote_average.toFixed(1) : '–'}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.price}>från {formatPrice(getPrice(movie, 'digital'))}</Text>

          {/* Snabbknapp: lägger till digitalt format direkt från listan */}
          <Pressable
            onPress={() => onQuickAdd(movie)}
            hitSlop={8}
            style={styles.addButton}
            accessibilityLabel={`Add ${movie.title} to cart`}
          >
            <Ionicons name={quantityInCart > 0 ? 'checkmark' : 'add'} size={20} color={colors.accentText} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

// memo = rita bara om kortet när dess props ändras.
export default memo(MovieCard);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    maxWidth: '48%', 
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  poster: { width: '100%', aspectRatio: 2 / 3, backgroundColor: colors.surfaceLight },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.accent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  badgeText: { color: colors.accentText, fontSize: 10, fontWeight: '800' },
  info: { padding: spacing.sm, gap: 2, flex: 1 },
  title: { color: colors.text, fontWeight: '700', fontSize: 14 },
  meta: { color: colors.textMuted, fontSize: 12 },
  footer: {
    marginTop: 'auto',
    paddingTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: { color: colors.accent, fontWeight: '700', fontSize: 13 },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});