import { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Animated, Vibration } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from './cart-context';
import ThemedHeader from '../components/ThemedHeader';
import PrimaryButton from '../components/PrimaryButton';
import ScreenBackground from '../components/ScreenBackground';
import FadeInView from '../components/FadeInView';
import { theme } from './theme';

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
      <ScreenBackground />
      <ThemedHeader title="Carrinho" subtitle="Verifique seu pedido antes de finalizar a compra" />

      <Animated.View pointerEvents="none" style={[styles.feedbackRemocao, estiloFeedbackAnimado]}>
        <View style={styles.feedbackLinha}>
          <View style={styles.feedbackIconeWrap}>
            <Text style={styles.feedbackIcone}>!</Text>
          </View>
          <Text style={styles.feedbackRemocaoTexto}>{mensagemFeedback}</Text>
        </View>
      </Animated.View>

      {carrinhoVazio ? (
        <FadeInView style={styles.estadoVazio} delay={70}>
          <Text style={styles.tituloVazio}>Seu carrinho esta vazio</Text>
          <Text style={styles.subtituloVazio}>Adicione produtos no cardapio para continuar.</Text>
        </FadeInView>
      ) : (
        <FadeInView style={styles.listaItensWrap} delay={70}>
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
        </FadeInView>
      )}

      <FadeInView style={styles.rodapeAcao} delay={120}>
        <PrimaryButton title="Ir para pagamento" disabled={carrinhoVazio} onPress={() => router.push('/pagamento')} />
      </FadeInView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  feedbackRemocao: {
    position: 'absolute',
    top: 102,
    left: 14,
    right: 14,
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.accent,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    zIndex: 4,
    ...theme.shadow,
  },
  feedbackLinha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedbackIconeWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.accent,
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
    color: theme.colors.text,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '700',
    flex: 1,
  },
  listaItensWrap: {
    flex: 1,
  },
  listaItens: {
    paddingHorizontal: 10,
    paddingTop: 26,
    paddingBottom: 12,
    gap: 10,
  },
  estadoVazio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  tituloVazio: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtituloVazio: {
    marginTop: 10,
    color: theme.colors.textMuted,
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  cardItem: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 18,
    minHeight: 98,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    ...theme.shadow,
  },
  imagemWrapper: {
    width: 74,
    height: 74,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#090909',
    borderWidth: 1,
    borderColor: '#242424',
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
    color: theme.colors.text,
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '700',
  },
  descricaoItem: {
    color: theme.colors.textMuted,
    fontSize: 13,
    lineHeight: 16,
    marginTop: 2,
  },
  valorItem: {
    color: theme.colors.accentSoft,
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
    backgroundColor: '#722537',
    borderColor: '#8E2A44',
  },
  botaoAumentar: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accentStrong,
  },
  quantidadeTexto: {
    color: theme.colors.text,
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
    paddingHorizontal: 10,
    paddingBottom: 14,
    paddingTop: 4,
  },
});