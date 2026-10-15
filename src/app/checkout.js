// CHECKOUT SCREEN - shown as a modal. Fake payment with validation.

import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../constants/theme';

export default function CheckoutScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Checkout</Text>
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
