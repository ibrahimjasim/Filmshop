import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing } from '../constants/theme';

/**
 * Appens huvudknapp. variant="outline" ger en sekundär knapp.
 */
export default function PrimaryButton({ title, onPress, disabled, loading, variant = 'solid', style }) {
  const isOutline = variant === 'outline';
  const inactive = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive }}
      // style kan vara en funktion som får veta om knappen är nedtryckt
      style={({ pressed }) => [
        styles.base,
        isOutline ? styles.outline : styles.solid,
        pressed && { opacity: 0.8 },
        inactive && { opacity: 0.5 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? colors.accent : colors.accentText} />
      ) : (
        <Text style={[styles.text, isOutline && { color: colors.accent }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 50,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  solid: { backgroundColor: colors.accent },
  outline: { borderWidth: 1.5, borderColor: colors.accent },
  text: { color: colors.accentText, fontSize: 16, fontWeight: '700' },
});