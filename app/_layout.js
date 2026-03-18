import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
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
  const { totalItens, avisoPedidoPronto } = useCart();
  const animacaoToast = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (avisoPedidoPronto) {
      Animated.timing(animacaoToast, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
      return;
    }

    Animated.timing(animacaoToast, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [animacaoToast, avisoPedidoPronto]);

  const estiloToastAnimado = {
    opacity: animacaoToast,
    transform: [
      {
        translateY: animacaoToast.interpolate({
          inputRange: [0, 1],
          outputRange: [-16, 0],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
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

      <Animated.View pointerEvents="none" style={[styles.toastContainer, estiloToastAnimado]}>
        <View style={styles.toastLinha}>
          <View style={styles.toastIconeWrap}>
            <Text style={styles.toastIcone}>✓</Text>
          </View>
          <View style={styles.toastConteudo}>
            <Text style={styles.toastTitulo}>Pedido pronto para retirada</Text>
            <Text style={styles.toastTexto}>{avisoPedidoPronto?.mensagem || ''}</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toastContainer: {
    position: 'absolute',
    top: 18,
    left: 12,
    right: 12,
    minHeight: 64,
    borderRadius: 16,
    backgroundColor: '#1C5A39',
    borderWidth: 1,
    borderColor: '#2F7C47',
    paddingHorizontal: 12,
    paddingVertical: 10,
    zIndex: 40,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.24,
    shadowRadius: 10,
    elevation: 10,
  },
  toastLinha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toastIconeWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2F7C47',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  toastIcone: {
    color: '#F6FFF8',
    fontSize: 14,
    fontWeight: '800',
  },
  toastConteudo: {
    flex: 1,
  },
  toastTitulo: {
    color: '#F6FFF8',
    fontSize: 15,
    fontWeight: '700',
  },
  toastTexto: {
    color: '#EAF8EF',
    fontSize: 13,
    marginTop: 2,
    fontWeight: '600',
  },
});