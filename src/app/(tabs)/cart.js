// CART SCREEN - the movies in the cart, quantities and total.
// All data comes from Redux – this screen fetches nothing from the API.

import { FlatList, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';

import CartItemRow from '../../components/CartItemRow';
import PrimaryButton from '../../components/PrimaryButton';
import { EmptyView, LoadingView } from '../../components/StatusViews';
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
  selectCartCount,
  selectCartHydrated,
  selectCartItems,
  selectCartTotal,
} from '../../store/cartSlice';
import { formatPrice } from '../../utils/pricing';
import { colors, radius, spacing } from '../../constants/theme';


export default function CartScreen(){
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const count = useSelector(selectCartCount);
  const total = useSelector(selectCartTotal);
  const hydrated = useSelector(selectCartHydrated);

  // For the short moment while AsyncStorage is loading, 
  if (!hydrated) return <LoadingView message='Loading cart...'/>
  
  if (items.length === 0) {
    return(
      <EmptyView icon='cart-outline' title ="Your cart is empty" message="Find something good to watch in the shop!">
        <PrimaryButton title="Go to the shop" onPress={() => router.navigate('/')} style={{marginTop: spacing.md}} />
      </EmptyView>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
      data={items}
      keyExtractor={(item) => item.key}
      contentContainerStyle={styles.list}
      renderItem={({item}) => (
        <CartItemRow 
        item={item}
        // dispatch sends an "action" to Redux, which runs the right reducer in cartSlice
        onIncrease={() => dispatch(increaseQuantity(item.key))}
        onDecrease={() => dispatch(decreaseQuantity(item.key))}
        onRemove={() => dispatch(removeFromCart(item.key))}
        onPress={() => router.push({pathname: '/movie/[id]', params: {id:String(item.movieId)}})}/>
      )}
      />

      {/* Summary at the bottom */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.label}>Items</Text>
          <Text style={styles.value}>{count}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.total}>{formatPrice(total)}</Text>
        </View>
        <PrimaryButton title="Go to checkout" onPress={() => router.push('/checkout')} />
      </View>
    </View>
  );

}


const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.lg, gap: spacing.md },
  summary: {
    padding: spacing.lg,
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { color: colors.textMuted, fontSize: 15 },
  value: { color: colors.text, fontSize: 15 },
  totalLabel: { color: colors.text, fontSize: 18, fontWeight: '700' },
  total: { color: colors.accent, fontSize: 22, fontWeight: '800' },
});