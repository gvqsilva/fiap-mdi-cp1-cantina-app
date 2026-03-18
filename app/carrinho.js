import { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Animated, Vibration } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from './cart-context';

const IMAGEM_PADRAO = require('../assets/splash-icon.png');

export default function Carrinho() {
  const router = useRouter();
  const { itens, aumentarQuantidade, diminuirQuantidade } = useCart();
  const [mensagemFeedback, setMensagemFeedback] = useState('');
  const animacaoFeedback = useRef(new Animated.Value(0)).current;
  const timerFeedbackRef = useRef(null);
  const itensAnterioresRef = useRef(itens);
  const carrinhoVazio = itens.length === 0;

  const exibirFeedbackRemocao = useCallback(
    (mensagem) => {
      setMensagemFeedback(mensagem);
      Vibration.vibrate(35);

      if (timerFeedbackRef.current) {
        clearTimeout(timerFeedbackRef.current);
      }

      Animated.timing(animacaoFeedback, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();

      timerFeedbackRef.current = setTimeout(() => {
        Animated.timing(animacaoFeedback, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }).start();
      }, 1400);
    },
    [animacaoFeedback]
  );

  useEffect(() => {
    const itensAnteriores = itensAnterioresRef.current;
    const itensRemovidos = itensAnteriores.filter(
      (itemAnterior) => !itens.some((itemAtual) => itemAtual.id === itemAnterior.id)
    );

    if (itensRemovidos.length > 0) {
      const nomeItem = itensRemovidos[0].nome || 'Item';
      exibirFeedbackRemocao(`${nomeItem} removido do carrinho`);
    }

    itensAnterioresRef.current = itens;
  }, [itens, exibirFeedbackRemocao]);

  useEffect(() => {
    return () => {
      if (timerFeedbackRef.current) {
        clearTimeout(timerFeedbackRef.current);
      }
    };
  }, []);

  const estiloFeedbackAnimado = {
    opacity: animacaoFeedback,
    transform: [
      {
        translateY: animacaoFeedback.interpolate({
          inputRange: [0, 1],
          outputRange: [-14, 0],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <View style={styles.topo}>
        <Text style={styles.titulo}>Carrinho</Text>
        <Text style={styles.subtitulo}>Verifique seu pedido antes de finalizar a compra</Text>
      </View>

      <Animated.View pointerEvents="none" style={[styles.feedbackRemocao, estiloFeedbackAnimado]}>
        <View style={styles.feedbackLinha}>
          <View style={styles.feedbackIconeWrap}>
            <Text style={styles.feedbackIcone}>!</Text>
          </View>
          <Text style={styles.feedbackRemocaoTexto}>{mensagemFeedback}</Text>
        </View>
      </Animated.View>

      {carrinhoVazio ? (
        <View style={styles.estadoVazio}>
          <Text style={styles.tituloVazio}>Seu carrinho esta vazio</Text>
          <Text style={styles.subtituloVazio}>Adicione produtos no cardapio para continuar.</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listaItens}>
          {itens.map((item) => (
            <View key={item.id} style={styles.cardItem}>
              <View style={styles.imagemWrapper}>
                <Image source={item.imagem || IMAGEM_PADRAO} style={styles.imagemProduto} resizeMode="cover" />
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.nomeItem}>{item.nome}</Text>
                <Text style={styles.descricaoItem}>{item.descricao}</Text>
                <Text style={styles.valorItem}>{item.valor}</Text>
              </View>

              <View style={styles.quantidadeContainer}>
                <TouchableOpacity
                  style={[styles.botaoQuantidade, styles.botaoDiminuir]}
                  activeOpacity={0.75}
                  onPress={() => diminuirQuantidade(item.id)}
                >
                  <Text style={styles.textoBotaoQuantidade}>-</Text>
                </TouchableOpacity>

                <Text style={styles.quantidadeTexto}>{item.quantidade}</Text>

                <TouchableOpacity
                  style={[styles.botaoQuantidade, styles.botaoAumentar]}
                  activeOpacity={0.75}
                  onPress={() => aumentarQuantidade(item.id)}
                >
                  <Text style={styles.textoBotaoQuantidade}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.rodapeAcao}>
        <TouchableOpacity
          style={[styles.botaoPagamento, carrinhoVazio && styles.botaoPagamentoDesabilitado]}
          activeOpacity={0.85}
          disabled={carrinhoVazio}
          onPress={() => router.push('/pagamento')}
        >
          <Text style={styles.botaoPagamentoTexto}>Ir para pagamento</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B8B8B8',
  },
  topo: {
    backgroundColor: '#AD395A',
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    paddingTop: 16,
    paddingHorizontal: 12,
    paddingBottom: 14,
  },
  titulo: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: 0.2,
  },
  subtitulo: {
    color: '#FFF1F5',
    fontSize: 16,
    lineHeight: 21,
    marginTop: 5,
    fontWeight: '500',
  },
  feedbackRemocao: {
    position: 'absolute',
    top: 96,
    left: 14,
    right: 14,
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: '#7A1D32',
    borderWidth: 1,
    borderColor: '#B03A5A',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    zIndex: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  feedbackLinha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedbackIconeWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#B03A5A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },
  feedbackIcone: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  feedbackRemocaoTexto: {
    color: '#FFF2F6',
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '700',
    flex: 1,
  },
  listaItens: {
    paddingHorizontal: 8,
    paddingTop: 20,
    paddingBottom: 10,
    gap: 10,
  },
  estadoVazio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  tituloVazio: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtituloVazio: {
    marginTop: 10,
    color: '#F2F2F2',
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  cardItem: {
    backgroundColor: '#E9E9E9',
    borderWidth: 1,
    borderColor: '#9A9A9A',
    borderRadius: 18,
    minHeight: 98,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  imagemWrapper: {
    width: 74,
    height: 74,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#3A3A3A',
    borderWidth: 1,
    borderColor: '#2F2F2F',
  },
  imagemProduto: {
    width: '100%',
    height: '100%',
  },
  infoItem: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  nomeItem: {
    color: '#1F1F1F',
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '700',
  },
  descricaoItem: {
    color: '#505050',
    fontSize: 13,
    lineHeight: 16,
    marginTop: 2,
  },
  valorItem: {
    color: '#2B2B2B',
    fontSize: 16,
    lineHeight: 18,
    marginTop: 5,
    fontWeight: '700',
  },
  quantidadeContainer: {
    minWidth: 112,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoQuantidade: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  botaoDiminuir: {
    backgroundColor: '#B34747',
    borderColor: '#933D3D',
  },
  botaoAumentar: {
    backgroundColor: '#55983E',
    borderColor: '#4B8438',
  },
  quantidadeTexto: {
    color: '#1A1A1A',
    fontSize: 23,
    lineHeight: 24,
    fontWeight: '700',
    marginHorizontal: 9,
    minWidth: 24,
    textAlign: 'center',
  },
  textoBotaoQuantidade: {
    color: '#FFFFFF',
    fontSize: 19,
    lineHeight: 20,
    fontWeight: '700',
  },
  rodapeAcao: {
    marginTop: 'auto',
    paddingHorizontal: 8,
    paddingBottom: 14,
    paddingTop: 4,
  },
  botaoPagamento: {
    height: 50,
    borderRadius: 25,
    backgroundColor: '#B03A5A',
    borderWidth: 1,
    borderColor: '#9C3050',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoPagamentoDesabilitado: {
    backgroundColor: '#8C6A75',
    borderColor: '#7A5A64',
  },
  botaoPagamentoTexto: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 26,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});