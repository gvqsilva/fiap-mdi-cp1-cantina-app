import { useEffect, useRef } from 'react';
import { Animated, LogBox, StyleSheet, Text, View } from 'react-native';
import { Stack, Tabs, useRouter, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CartProvider, useCart } from './cart-context';
import { AuthProvider, useAuth } from './auth-context';
import { theme } from './theme';

if (__DEV__) {
  LogBox.ignoreLogs([
    "Call to function 'ExpoKeepAwake.activate' has been rejected.",
    'The current activity is no longer available',
  ]);
}

export default function Layout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

function RootNavigator() {
  const router = useRouter();
  const segments = useSegments();
  const { usuarioLogado, carregandoSessao } = useAuth();
  const segmentoAtual = segments[0];
  const estaEmAuth = segmentoAtual === 'login' || segmentoAtual === 'cadastro' || segmentoAtual === 'escolher-tipo';

  useEffect(() => {
    if (carregandoSessao) {
      return;
    }

    if (!usuarioLogado && !estaEmAuth) {
      router.replace('/login');
      return;
    }

    if (usuarioLogado && estaEmAuth) {
      router.replace('/home');
    }
  }, [carregandoSessao, estaEmAuth, router, usuarioLogado]);

  if (carregandoSessao) {
    return <View style={styles.container} />;
  }

    if (!usuarioLogado) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="escolher-tipo" />
        <Stack.Screen name="cadastro" />
      </Stack>
    );
  }

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
          tabBarActiveTintColor: theme.colors.accent,
          tabBarInactiveTintColor: '#858585',
          tabBarStyle: {
            height: 64,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
            paddingBottom: 6,
            paddingTop: 6,
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
          name="cardapio"
          options={{
            title: 'Cardápio',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'restaurant' : 'restaurant-outline'} size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="carrinho"
          options={{
            title: 'Carrinho',
            tabBarBadge: totalItens > 0 ? String(totalItens) : undefined,
            tabBarBadgeStyle: {
              backgroundColor: theme.colors.accent,
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
        <Tabs.Screen
          name="login"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />
        <Tabs.Screen
          name="cadastro"
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
    backgroundColor: theme.colors.background,
  },
  toastContainer: {
    position: 'absolute',
    top: 18,
    left: 12,
    right: 12,
    minHeight: 64,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 10,
    zIndex: 40,
    ...theme.shadow,
    ...theme.glow,
  },
  toastLinha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toastIconeWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  toastIcone: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  toastConteudo: {
    flex: 1,
  },
  toastTitulo: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  toastTexto: {
    color: theme.colors.textMuted,
    fontSize: 13,
    marginTop: 2,
    fontWeight: '600',
  },
});