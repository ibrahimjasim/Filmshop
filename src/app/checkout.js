// CHECKOUT with a FAKE payment (requirement: no real payment/backend).
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';

import PrimaryButton from '../components/PrimaryButton';
import { clearCart, selectCartCount, selectCartTotal } from '../store/cartSlice';
import { formatPrice } from '../utils/pricing';
import { colors, radius, spacing } from '../constants/theme';

const FAKE_PAYMENT_DELAY_MS = 2000;

/** Simple email check: something@something.something */
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());


/** Waits ms milliseconds – used to pretend the payment takes time. */
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function CheckoutScreen() {
  const dispatch = useDispatch();
  const count = useSelector(selectCartCount);
  const total = useSelector(selectCartTotal);


  // status: 'form' | 'processing' | 'done'

  const [status, setStatus] = useState('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState(null);
  const [showErrors, setShowErrors] = useState(false);


   // Derived validation – recalculated on every render
   const nameError = name.trim().length < 2 ? 'Please enter your name.' : null;
   const emailError = !isValidEmail (email) ? 'Please enter a valid email address.' : null;


   async function handlePay() {
    setShowErrors(true);
    if (nameError || emailError) return;

    setStatus('processing');
    await wait(FAKE_PAYMENT_DELAY_MS); //"sending to the bank..."



     // Random order number so it looks real, e.g. FS-483920
     setOrderNumber(`FS-${Math.floor(100000 + Math.random() * 900000)}`);
     dispatch(clearCart()); // empties the cart (and therefore AsyncStorage)
    setStatus('done');
  }

  function backToShop() {
    router.dismissAll(); // close the modal and any detail screens
    router.navigate('/'); // go to the Shop tab
  }

  // ── State 3: done ──
  if (status === 'done') {
    return (
      <View style={styles.center}>
        <Ionicons name="checkmark-circle" size={80} color={colors.success} />
        <Text style={styles.doneTitle}>Thank you for your order!</Text>
        <Text style={styles.muted}>Order number: {orderNumber}</Text>
        <Text style={styles.muted}>A (pretend) confirmation has been sent to {email.trim()}.</Text>
        <PrimaryButton
          title="Back to the shop"
          onPress={backToShop}
          style={{ alignSelf: 'stretch', marginTop: spacing.lg }}
        />
      </View>
    );
  }

  // If someone opens the checkout with an empty cart
  if (count === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.doneTitle}>Your cart is empty</Text>
        <PrimaryButton title="Go to the shop" onPress={backToShop} style={{ alignSelf: 'stretch' }} />
      </View>
    );
  }

  const processing = status === 'processing';

  // ── States 1 & 2: the form (+ spinner on the button while we "pay") ──
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your order</Text>
          <View style={styles.row}>
            <Text style={styles.muted}>{count} items</Text>
            <Text style={styles.total}>{formatPrice(total)}</Text>
          </View>
        </View>

        <Text style={styles.label}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="First name Last name"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          editable={!processing}
          autoComplete="name"
        />
        {showErrors && nameError && <Text style={styles.error}>{nameError}</Text>}

        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="name@example.com"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          editable={!processing}
        />
        {showErrors && emailError && <Text style={styles.error}>{emailError}</Text>}

        <View style={styles.notice}>
          <Ionicons name="information-circle-outline" size={18} color={colors.textMuted} />
          <Text style={[styles.muted, { flex: 1, textAlign: 'left' }]}>
            This is a demo shop. No real payment is made.
          </Text>
        </View>

        <PrimaryButton title={`Pay ${formatPrice(total)}`} onPress={handlePay} loading={processing} />
        {processing && <Text style={styles.muted}>Processing payment...</Text>}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.sm },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm, marginBottom: spacing.md },
  cardTitle: { color: colors.text, fontSize: 18, fontWeight: '700' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  total: { color: colors.accent, fontSize: 22, fontWeight: '800' },
  label: { color: colors.text, fontWeight: '600', marginTop: spacing.sm },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
  },
  error: { color: colors.danger, fontSize: 13 },
  notice: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center', marginVertical: spacing.md },
  muted: { color: colors.textMuted, fontSize: 15, textAlign: 'center' },
  doneTitle: { color: colors.text, fontSize: 24, fontWeight: '800', textAlign: 'center', marginTop: spacing.md },
});