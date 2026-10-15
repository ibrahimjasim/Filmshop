// CART SCREEN - the movies in the cart, quantities and total.

import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../../constants/theme';

export default function CartScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Cart</Text>
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
