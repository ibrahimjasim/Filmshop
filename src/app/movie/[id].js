// DETAIL SCREEN - one movie, chosen format and "add to cart".
// [id] in the file name means the movie id is part of the address: /movie/550

import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors, spacing } from '../../constants/theme';

export default function MovieDetailScreen() {
  // Reads the id from the address, e.g. "550"
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Movie {id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  text: { color: colors.text, fontSize: 18, fontWeight: '700' },
});
