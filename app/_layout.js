import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CartProvider, useCart } from './cart-context';

export default function Layout() {
  return (
    <CartProvider>
      <TabsLayout />
    </CartProvider>
  );
}

function TabsLayout() {
  const { totalItens } = useCart();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#B03A5A',
        tabBarInactiveTintColor: '#646464',
        tabBarStyle: {
          height: 56,
          borderTopWidth: 1,
          borderTopColor: '#BDBDBD',
          backgroundColor: '#F3F3F3',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="carrinho"
        options={{
          title: 'Carrinho',
          tabBarBadge: totalItens > 0 ? String(totalItens) : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#B03A5A',
            color: '#FFFFFF',
            fontSize: 10,
            lineHeight: 12,
            minWidth: 14,
            height: 14,
            paddingHorizontal: 0,
          },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'cart' : 'cart-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person-circle' : 'person-circle-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pagamento"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="processando-pagamento"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="pedido"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
    </Tabs>
  );
}