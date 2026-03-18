import { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated, Easing } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { useCart } from './cart-context';

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
  const { flowId } = useLocalSearchParams();
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
      const tempoEstimado = calcularTempoEstimado(itensRef.current);
      registrarPedido(idPedido, itensRef.current, tempoEstimado);
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
  }, [flowId, idPedido, isFocused, limparCarrinho, progresso, registrarPedido, router]);

  const larguraProgresso = progresso.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <ActivityIndicator size="large" color="#B03A5A" />
        <Text style={styles.titulo}>{`Processando pagamento${sufixoLoading}`}</Text>
        <Text style={styles.subtitulo}>Estamos confirmando sua compra</Text>

        <View style={styles.progressoFundo}>
          <Animated.View style={[styles.progressoPreenchimento, { width: larguraProgresso }]} />
        </View>

        <Text style={styles.tempoTexto}>Isso leva cerca de 3 segundos</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A5A5A5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  card: {
    width: '98%',
    minHeight: 300,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#8A8A8A',
    backgroundColor: '#E1E1E1',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  titulo: {
    marginTop: 16,
    color: '#2A2A2A',
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitulo: {
    marginTop: 8,
    color: '#505050',
    fontSize: 17,
    textAlign: 'center',
  },
  progressoFundo: {
    marginTop: 22,
    width: '92%',
    height: 14,
    borderRadius: 7,
    backgroundColor: '#CFCFCF',
    borderWidth: 1,
    borderColor: '#B4B4B4',
    overflow: 'hidden',
  },
  progressoPreenchimento: {
    height: '100%',
    borderRadius: 7,
    backgroundColor: '#B03A5A',
  },
  tempoTexto: {
    marginTop: 12,
    color: '#5C5C5C',
    fontSize: 14,
    fontWeight: '500',
  },
});
