import { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated, Easing } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { useCart } from './cart-context';
import { useAuth } from './auth-context';
import ScreenBackground from '../components/ScreenBackground';
import FadeInView from '../components/FadeInView';
import { theme } from './theme';

const DURACAO_PROCESSAMENTO_MS = 2800;
const TEMPO_POR_CATEGORIA = {
  salgado: 4,
  salgados: 4,
  bebida: 2,
  bebidas: 2,
  doce: 3,
  doces: 3,
  combo: 8,
  combos: 8,
};

function calcularTempoEstimado(itensPedido) {
  if (!Array.isArray(itensPedido) || itensPedido.length === 0) {
    return 0;
  }

  const totalMinutos = itensPedido.reduce((acumulado, item) => {
    const categoriaNormalizada = String(item?.categoria || '').trim().toLowerCase();
    const minutosBase = TEMPO_POR_CATEGORIA[categoriaNormalizada] ?? 3;
    const quantidade = Number(item?.quantidade || 0);

    return acumulado + minutosBase * quantidade;
  }, 0);

  return totalMinutos;
}

export default function ProcessandoPagamento() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const { flowId, cupom, desconto, totalFinal } = useLocalSearchParams();
  const { usuarioLogado } = useAuth();
  const { limparCarrinho, registrarPedido, itens } = useCart();
  const progresso = useRef(new Animated.Value(0)).current;
  const itensRef = useRef(itens);
  const [sufixoLoading, setSufixoLoading] = useState('');

  const idPedido = useMemo(() => {
    const aleatorio = Math.floor(1000 + Math.random() * 9000);
    return `#${aleatorio}`;
  }, [flowId]);

  useEffect(() => {
    itensRef.current = itens;
  }, [itens]);

  useEffect(() => {
    if (!isFocused) {
      return undefined;
    }

    progresso.stopAnimation();
    progresso.setValue(0);
    setSufixoLoading('');

    Animated.timing(progresso, {
      toValue: 1,
      duration: DURACAO_PROCESSAMENTO_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    const animacaoPontos = setInterval(() => {
      setSufixoLoading((atual) => {
        if (atual.length >= 3) {
          return '';
        }

        return `${atual}.`;
      });
    }, 420);

    const temporizador = setTimeout(() => {
      const tempoBase = calcularTempoEstimado(itensRef.current);
      const ehProfessor = usuarioLogado?.papel === 'professor';
      const tempoEstimado = ehProfessor ? Math.max(1, Math.ceil(tempoBase * 0.7)) : tempoBase;
      const descontoAplicado = Number(desconto || 0);
      const totalPedidoFinal = Number(totalFinal || 0);
      registrarPedido(idPedido, itensRef.current, tempoEstimado, {
        cupom: typeof cupom === 'string' ? cupom : '',
        descontoOrigem: Number(descontoAplicado) > 0 ? 'fidelidade' : '',
        descontoAplicado: Number.isFinite(descontoAplicado) ? descontoAplicado : 0,
        totalPedidoFinal: Number.isFinite(totalPedidoFinal) && totalPedidoFinal > 0 ? totalPedidoFinal : undefined,
      });
      limparCarrinho();
      router.replace({
        pathname: '/pedido',
        params: { id: idPedido, tempo: String(Math.max(tempoEstimado, 1)) },
      });
    }, DURACAO_PROCESSAMENTO_MS);

    return () => {
      clearTimeout(temporizador);
      clearInterval(animacaoPontos);
      progresso.stopAnimation();
    };
  }, [flowId, idPedido, isFocused, limparCarrinho, progresso, registrarPedido, router, usuarioLogado?.papel]);

  const larguraProgresso = progresso.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <ScreenBackground />
      <FadeInView style={styles.card}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <Text style={styles.titulo}>{`Processando pagamento${sufixoLoading}`}</Text>
        <Text style={styles.subtitulo}>Estamos confirmando sua compra</Text>

        <View style={styles.progressoFundo}>
          <Animated.View style={[styles.progressoPreenchimento, { width: larguraProgresso }]} />
        </View>

        <Text style={styles.tempoTexto}>Isso leva cerca de 3 segundos</Text>
      </FadeInView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  card: {
    width: '97%',
    minHeight: 300,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    ...theme.shadow,
  },
  titulo: {
    marginTop: 16,
    color: theme.colors.text,
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitulo: {
    marginTop: 8,
    color: theme.colors.textMuted,
    fontSize: 17,
    textAlign: 'center',
  },
  progressoFundo: {
    marginTop: 22,
    width: '92%',
    height: 14,
    borderRadius: 7,
    backgroundColor: '#0D0D0D',
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  progressoPreenchimento: {
    height: '100%',
    borderRadius: 7,
    backgroundColor: theme.colors.accent,
  },
  tempoTexto: {
    marginTop: 12,
    color: theme.colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
});
