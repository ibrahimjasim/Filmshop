// En rad i kundvagnen med +/- för antal och en ta bort-knapp.

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { imageUrl } from '../api/tmdb';
import { formatPrice } from '../utils/pricing';
import { colors, radius, spacing } from '../constants/theme';




export default function CartItemRow({item, onIncrease, onDecrease, onRemove, onPress}) {
    const poster = imageUrl(item.posterPath, 'w185');


    return (
        <View style={styles.row}>
            <Pressable onPress={onPress}>
                {poster ? (
                    <Image source={poster} style={styles.poster} contentFit="cover"/>
                
                ): (
                    <View style={[styles.poster, {backgroundColor: colors.surfaceLight}]}/>

                )}
            </Pressable>
            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={2}>
                    {item.title}
                </Text>
                <Text style={styles.format}>{item.formatLabel}</Text>
                <Text style={styles.price}>{formatPrice(item.price * item.quantity)}</Text>

                <View style={styles.controls}>
                    <Pressable onPress={onDecrease} style={styles.stepButton} accessibilityLabel="Reduce the number">
                        <Ionicons name="remove" size={18} color={colors.text} /> 
                    </Pressable>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <Pressable onPress={onIncrease} style={styles.stepButton} accessibilityLabel="Increase the number">
                        <Ionicons name="add" size={18} color = {colors.text} />
                    </Pressable>
                    <Pressable onPress={onRemove} style={styles.remove} accessibilityLabel="Remove from the cart">
                      <Ionicons name="trash-outline" size={20} color={colors.danger} />
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  poster: { width: 70, height: 105, borderRadius: radius.sm },
  info: { flex: 1, gap: 2 },
  title: { color: colors.text, fontWeight: '700', fontSize: 15 },
  format: { color: colors.textMuted, fontSize: 13 },
  price: { color: colors.accent, fontWeight: '700', fontSize: 15, marginTop: 2 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: 'auto' },
  stepButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: { color: colors.text, fontSize: 16, fontWeight: '700', minWidth: 18, textAlign: 'center' },
  remove: { marginLeft: 'auto', padding: 4 },
});