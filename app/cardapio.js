import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Animated } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useCart } from './cart-context';
import ThemedHeader from '../components/ThemedHeader';
import ScreenBackground from '../components/ScreenBackground';
import FadeInView from '../components/FadeInView';
import ScalePressable from '../components/ScalePressable';
import CardapioSkeleton from '../components/CardapioSkeleton';
import { theme } from './theme';
import { CATEGORIAS, PRODUTOS, PRODUTOS_DESTAQUE } from './menu-data';

const FILTRO_DESTAQUES = 'Destaques';

export default function Cardapio() {
  const { filtro, entrada } = useLocalSearchParams();
  const filtroDestaquesAtivo = typeof filtro === 'string' && filtro.toLowerCase() === 'destaques';
  const entradaCinematica = typeof entrada === 'string' && entrada.toLowerCase() === 'cinema';
  const categoriasDisponiveis = useMemo(
    () => ['Tudo', FILTRO_DESTAQUES, ...CATEGORIAS.filter((categoria) => categoria !== 'Tudo')],
    []
  );
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(filtroDestaquesAtivo ? FILTRO_DESTAQUES : 'Tudo');
  const [carregandoProdutos, setCarregandoProdutos] = useState(true);
  const [itensAdicionadosVisual, setItensAdicionadosVisual] = useState({});
  const [mensagemToast, setMensagemToast] = useState('');
  const animacaoEntrada = useRef(new Animated.Value(entradaCinematica ? 0 : 1)).current;
  const timersFeedbackRef = useRef({});
  const timerToastRef = useRef(null);
  const animacaoToast = useRef(new Animated.Value(0)).current;
  const { adicionarItem } = useCart();

  useEffect(() => {
    const timer = setTimeout(() => {
      setCarregandoProdutos(false);
    }, 650);

    return () => clearTimeout(timer);
  }, []);

  const marcarItemAdicionado = useCallback((produtoId) => {
    setItensAdicionadosVisual((estadoAtual) => ({ ...estadoAtual, [produtoId]: true }));

    if (timersFeedbackRef.current[produtoId]) {
      clearTimeout(timersFeedbackRef.current[produtoId]);
    }

    timersFeedbackRef.current[produtoId] = setTimeout(() => {
      setItensAdicionadosVisual((estadoAtual) => {
        const proximoEstado = { ...estadoAtual };
        delete proximoEstado[produtoId];
        return proximoEstado;
      });

      delete timersFeedbackRef.current[produtoId];
    }, 900);
  }, []);

  const exibirToast = useCallback(
    (nomeProduto) => {
      setMensagemToast(`${nomeProduto} adicionado ao carrinho`);

      if (timerToastRef.current) {
        clearTimeout(timerToastRef.current);
      }

      Animated.timing(animacaoToast, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      timerToastRef.current = setTimeout(() => {
        Animated.timing(animacaoToast, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }, 1300);
    },
    [animacaoToast]
  );

  useEffect(() => {
    if (filtroDestaquesAtivo) {
      setCategoriaSelecionada(FILTRO_DESTAQUES);
    }
  }, [filtroDestaquesAtivo]);

  useEffect(() => {
    if (!entradaCinematica) {
      animacaoEntrada.setValue(1);
      return;
    }

    animacaoEntrada.setValue(0);
    Animated.timing(animacaoEntrada, {
      toValue: 1,
      duration: 420,
      useNativeDriver: true,
    }).start();
  }, [animacaoEntrada, entradaCinematica]);

  useEffect(() => {
    return () => {
      Object.values(timersFeedbackRef.current).forEach((timerId) => clearTimeout(timerId));
      timersFeedbackRef.current = {};

      if (timerToastRef.current) {
        clearTimeout(timerToastRef.current);
      }
    };
  }, []);

  const estiloToastAnimado = {
    opacity: animacaoToast,
    transform: [
      {
        translateY: animacaoToast.interpolate({
          inputRange: [0, 1],
          outputRange: [16, 0],
        }),
      },
    ],
  };

  const estiloEntradaCinema = {
    opacity: animacaoEntrada.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    }),
    transform: [
      {
        scale: animacaoEntrada.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.08],
        }),
      },
    ],
  };

  const produtosFiltrados = useMemo(() => {
    if (categoriaSelecionada === FILTRO_DESTAQUES) {
      return PRODUTOS_DESTAQUE;
    }

    if (categoriaSelecionada === 'Tudo') {
      return PRODUTOS;
    }

    return PRODUTOS.filter((produto) => produto.categoria === categoriaSelecionada);
  }, [categoriaSelecionada]);

  return (
    <View style={styles.container}>
      <ScreenBackground />
      <ThemedHeader
        title="Cardápio"
        subtitle={
          categoriaSelecionada === FILTRO_DESTAQUES
            ? 'Mostrando apenas os destaques do dia'
            : 'Escolha seus itens e adicione ao carrinho'
        }
      />

      <FadeInView delay={40} style={styles.heroCategoria}>
        <View style={styles.heroCategoriaBg}>
          <Text style={styles.heroNomeCategoria}>{categoriaSelecionada}</Text>
          <Text style={styles.heroDescricao}>
            {categoriaSelecionada === FILTRO_DESTAQUES 
              ? 'Seleções especiais do dia'
              : categoriaSelecionada === 'Tudo'
              ? 'Todos os nossos itens'
              : `Produtos da categoria ${categoriaSelecionada}`}
          </Text>
          <Text style={styles.heroContador}>{produtosFiltrados.length} produto(s)</Text>
        </View>
      </FadeInView>

      <FadeInView delay={40}>
        <ScrollView
        horizontal
        style={styles.categoriasScroll}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listaCategorias}
        >
        {categoriasDisponiveis.map((categoria, index) => {
          const ativo = categoriaSelecionada === categoria;
          const ultimoItem = index === categoriasDisponiveis.length - 1;

          return (
            <TouchableOpacity
              key={categoria}
              style={[
                styles.chipCategoria,
                !ultimoItem && styles.chipCategoriaComEspaco,
                ativo && styles.chipCategoriaAtivo,
              ]}
              onPress={() => setCategoriaSelecionada(categoria)}
              activeOpacity={0.8}
              hitSlop={{ top: 6, right: 6, bottom: 6, left: 6 }}
            >
              <Text style={[styles.textoChip, ativo && styles.textoChipAtivo]}>{categoria}</Text>
            </TouchableOpacity>
          );
        })}
        </ScrollView>
      </FadeInView>

      <FadeInView delay={90} style={styles.listaProdutosWrap}>
        {carregandoProdutos ? (
          <CardapioSkeleton />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listaProdutos}>
            {produtosFiltrados.map((produto) => {
              const adicionadoAgora = Boolean(itensAdicionadosVisual[produto.id]);

              return (
                <ScalePressable key={produto.id} style={[styles.cardProduto, adicionadoAgora && styles.cardProdutoAtivo]}>
                  <View style={styles.imagemPlaceholder}>
                    <Image source={produto.imagem} style={styles.imagemProduto} resizeMode="cover" />
                  </View>

                  <View style={styles.infoProduto}>
                    <Text style={styles.nomeProduto}>{produto.nome}</Text>
                    <Text style={styles.descricaoProduto}>{produto.descricao}</Text>
                    <Text style={styles.valorProduto}>{produto.valor}</Text>
                    {adicionadoAgora ? <Text style={styles.feedbackItem}>Adicionado ao carrinho</Text> : null}
                  </View>

                  <TouchableOpacity
                    style={[styles.botaoAdicionar, adicionadoAgora && styles.botaoAdicionarAtivo]}
                    activeOpacity={0.8}
                    onPress={() => {
                      adicionarItem(produto);
                      marcarItemAdicionado(produto.id);
                      exibirToast(produto.nome);
                    }}
                  >
                    <Text style={styles.textoAdicionar}>{adicionadoAgora ? '✓' : '+'}</Text>
                  </TouchableOpacity>
                </ScalePressable>
              );
            })}
          </ScrollView>
        )}
      </FadeInView>

      <Animated.View pointerEvents="none" style={[styles.toastContainer, estiloToastAnimado]}>
        <View style={styles.toastLinha}>
          <View style={styles.toastIconeWrap}>
            <Text style={styles.toastIcone}>✓</Text>
          </View>
          <Text style={styles.toastTexto}>{mensagemToast}</Text>
        </View>
      </Animated.View>

      {entradaCinematica ? <Animated.View pointerEvents="none" style={[styles.cinemaOverlay, estiloEntradaCinema]} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  heroCategoria: {
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 8,
    borderRadius: 18,
    overflow: 'hidden',
  },
  heroCategoriaBg: {
    backgroundColor: '#1A1217',
    borderWidth: 1,
    borderColor: '#3A2B33',
    paddingHorizontal: 16,
    paddingVertical: 14,
    ...theme.shadow,
  },
  heroNomeCategoria: {
    color: theme.colors.accent,
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 28,
  },
  heroDescricao: {
    color: theme.colors.textMuted,
    fontSize: 14,
    marginTop: 4,
    lineHeight: 17,
  },
  heroContador: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
  },
  categoriasScroll: {
    flexGrow: 0,
    maxHeight: 54,
  },
  listaCategorias: {
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
  chipCategoria: {
    marginTop: 2,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    width: 92,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipCategoriaComEspaco: {
    marginRight: 7,
  },
  chipCategoriaAtivo: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accentStrong,
    ...theme.glow,
  },
  textoChip: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  textoChipAtivo: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listaProdutosWrap: {
    flex: 1,
  },
  listaProdutos: {
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 22,
    gap: 10,
  },
  cardProduto: {
    backgroundColor: theme.colors.surface,
    minHeight: 110,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadow,
    marginBottom: 6,
    overflow: 'hidden',
  },
  cardProdutoAtivo: {
    borderColor: theme.colors.accent,
    backgroundColor: '#201218',
  },
  imagemPlaceholder: {
    width: 86,
    height: 86,
    borderRadius: 16,
    backgroundColor: '#090909',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#232323',
  },
  imagemProduto: {
    width: '100%',
    height: '100%',
  },
  infoProduto: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10,
  },
  nomeProduto: {
    color: theme.colors.text,
    fontSize: 22,
    lineHeight: 25,
    fontWeight: '800',
  },
  descricaoProduto: {
    color: theme.colors.textMuted,
    fontSize: 13,
    marginTop: 3,
    lineHeight: 16,
  },
  valorProduto: {
    color: theme.colors.accent,
    fontSize: 17,
    marginTop: 6,
    lineHeight: 20,
    fontWeight: '800',
  },
  feedbackItem: {
    marginTop: 4,
    color: theme.colors.success,
    fontSize: 12,
    fontWeight: '700',
  },
  botaoAdicionar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: theme.colors.accent,
    borderWidth: 1.5,
    borderColor: theme.colors.accentStrong,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow,
  },
  botaoAdicionarAtivo: {
    backgroundColor: '#882A45',
    borderColor: '#932A48',
  },
  textoAdicionar: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginTop: -1,
  },
  toastContainer: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 22,
    minHeight: 50,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.accent,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    zIndex: 6,
    ...theme.shadow,
  },
  toastLinha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toastIconeWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },
  toastIcone: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  toastTexto: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  cinemaOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    zIndex: 20,
  },
});
