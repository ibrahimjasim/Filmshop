// The tab navigator at the bottom: "Shop" and "Cart".
import { Tabs } from "expo-router/js-tabs";
import { useSelector } from "react-redux";
import { selectCartCount } from "../../store/cartSlice";
import { colors } from "../../constants/theme";
import { Ionicons } from "@expo/vector-icons";




export default function TabsLayout(){
 // Reads the number of items from Redux. The component re-renders automatically
    // when the number changes – so the badge on the tab is always up to date.

    const cartCount = useSelector(selectCartCount)

    return (
        <Tabs
        screenOptions={{
            headerStyle: {backgroundColor: colors.background},
            headerTintColor: colors.text,
            headerTitleStyle: { fontWeight: '700'},
            tabBarStyle : {backgroundColor: colors.surface, borderTopColor: colors.border},
            tabBarActiveTintColor: colors.accent,
            tabBarInactiveTintColor: colors.textMuted,
            sceneStyle: {backgroundColor: colors.background},
        }}
        >

            <Tabs.Screen
            name="index"
            options={{
                title: 'FilmShop',
                tabBarLabel: 'Shop',
                tabBarIcon: ({color,size}) => <Ionicons name="film-outline" size={size} color= {color} />

            }}
            />

            <Tabs.Screen
            name="cart"
            options={{
                title:'Cart',
                tabBarIcon: ({color, size}) => <Ionicons name="cart-outline" size={size} color={color}/>,
                // undefined = no badge at all when the cart is empty
                tabBarBadge: cartCount > 0 ? cartCount : undefined,
                tabBarBadgeStyle: { backgroundColor: colors.accent, color: colors.accentText },
            }}
            />
        </Tabs>
    );
}