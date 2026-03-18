import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from './cart-context';

const CATEGORIAS = ['Tudo', 'Salgado', 'Doce', 'Bebidas', 'Combos'];
const IMAGEM_PERFIL = require('../assets/user.jpg');
const IMAGEM_COXINHA = require('../assets/coxinha.jpg');
const IMAGEM_PAO_QUEIJO = require('../assets/pao-queijo.jpg');
const IMAGEM_BOLO = require('../assets/bolo.jpg');
const IMAGEM_COCA = require('../assets/coca.jpg');
const IMAGEM_COMBO1 = require('../assets/combo1.webp');
const IMAGEM_COCAZ = require('../assets/coca-zero.webp');
const IMAGEM_CROISSANTCHOCO = require('../assets/croissants-choco.jpg');
const IMAGEM_CROISSANTFRANGO = require('../assets/croissants-frango.jpg');
const IMAGEM_CROISSANTPQ = require('../assets/croissants-presunto_queijo.jpg');
const IMAGEM_ESFIRRA = require('../assets/esfirra-carne.jpg');
const IMAGEM_COOKIE = require('../assets/cookie.jpg');
const IMAGEM_CAFEP = require('../assets/cafe-p.webp');
const IMAGEM_CAFEM = require('../assets/cafe-m.jpg');
const IMAGEM_AGUACOM = require('../assets/agua-com.webp');
const IMAGEM_AGUA = require('../assets/agua.webp');


const PRODUTOS = [
  {
    id: 1,
    nome: 'Coxinha de frango',
    descricao: '',
    valor: 'R$ 10,00',
    categoria: 'Salgado',
    imagem: IMAGEM_COXINHA,
  },
  {
    id: 2,
    nome: 'Pão de queijo',
    descricao: '',
    valor: 'R$ 8,50',
    categoria: 'Salgado',
    imagem: IMAGEM_PAO_QUEIJO,
  },
  {
    id: 3,
    nome: 'Coca-Cola',
    descricao: '350ml',
    valor: 'R$ 6,00',
    categoria: 'Bebidas',
    imagem: IMAGEM_COCA,
  },
  {
    id: 4,
    nome: 'Bolo de Cenoura',
    descricao: '',
    valor: 'R$ 6,00',
    categoria: 'Doce',
    imagem: IMAGEM_BOLO,
  },
  {
    id: 5,
    nome: 'Água',
    descricao: '500ml',
    valor: 'R$ 4,50',
    categoria: 'Bebidas',
    imagem: IMAGEM_AGUA,
  },
  {
    id: 6,
    nome: 'Café Pequeno',
    descricao: '50ml',
    valor: 'R$ 4,00',
    categoria: 'Bebidas',
    imagem: IMAGEM_CAFEP,
  },
  {
    id: 7,
    nome: 'Pão de queijo + Café',
    descricao: 'Combo de Pão de Queijo com Café Médio, 100ml',
    valor: 'R$ 15,00',
    categoria: 'Combos',
    imagem: IMAGEM_COMBO1,
  },
  {
    id: 8,
    nome: 'Coca-Cola Zero',
    descricao: '350ml',
    valor: 'R$ 6,00',
    categoria: 'Bebidas',
    imagem: IMAGEM_COCAZ,
  },
  {
    id: 9,
    nome: 'Cookie',
    descricao: '',
    valor: 'R$ 7,50',
    categoria: 'Doce',
    imagem: IMAGEM_COOKIE,
  },
  {
    id: 10,
    nome: 'Café Médio',
    descricao: '100ml',
    valor: 'R$ 5,50',
    categoria: 'Bebidas',
    imagem: IMAGEM_CAFEM,
  },
  {
    id: 11,
    nome: 'Croissant de chocolate',
    descricao: '',
    valor: 'R$ 12,50',
    categoria: 'Doce',
    imagem: IMAGEM_CROISSANTCHOCO,
  },
  {
    id: 12,
    nome: 'Croissant de frango',
    descricao: '',
    valor: 'R$ 12,00',
    categoria: 'Salgado',
    imagem: IMAGEM_CROISSANTFRANGO,
  },
  {
    id: 13,
    nome: 'Água com gás',
    descricao: '500ml',
    valor: 'R$ 5,50',
    categoria: 'Bebidas',
    imagem: IMAGEM_AGUACOM,
  },
  {
    id: 14,
    nome: 'Croissant de presunto e queijo',
    descricao: '',
    valor: 'R$ 12,00',
    categoria: 'Salgado',
    imagem: IMAGEM_CROISSANTPQ,
  },
  {
    id: 15,
    nome: 'Esfirra de carne',
    descricao: '',
    valor: 'R$ 12,00',
    categoria: 'Salgado',
    imagem: IMAGEM_ESFIRRA,
  },
];

export default function Home() {
  const router = useRouter();
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Tudo');
  const [itensAdicionadosVisual, setItensAdicionadosVisual] = useState({});
  const [mensagemToast, setMensagemToast] = useState('');
  const timersFeedbackRef = useRef({});
  const timerToastRef = useRef(null);
  const animacaoToast = useRef(new Animated.Value(0)).current;
  const { adicionarItem } = useCart();

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

  const produtosFiltrados = useMemo(() => {
    if (categoriaSelecionada === 'Tudo') {
      return PRODUTOS;
    }

    return PRODUTOS.filter((produto) => produto.categoria === categoriaSelecionada);
  }, [categoriaSelecionada]);

  return (
    <View style={styles.container}>
      <View style={styles.topo}>
        <View>
          <Text style={styles.logo}>FiaPass</Text>
          <Text style={styles.subtitulo}>FIAP x Kitchenette</Text>
        </View>

        <TouchableOpacity style={styles.botaoPerfil} activeOpacity={0.85} onPress={() => router.push('/perfil')}>
          <Image source={IMAGEM_PERFIL} style={styles.imagemPerfil} resizeMode="cover" />
        </TouchableOpacity>
      </View>

      <Text style={styles.tituloCardapio}>Cardápio</Text>

      <ScrollView
        horizontal
        style={styles.categoriasScroll}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listaCategorias}
      >
        {CATEGORIAS.map((categoria, index) => {
          const ativo = categoriaSelecionada === categoria;
          const ultimoItem = index === CATEGORIAS.length - 1;

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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listaProdutos}>
        {produtosFiltrados.map((produto) => {
          const adicionadoAgora = Boolean(itensAdicionadosVisual[produto.id]);

          return (
          <View key={produto.id} style={[styles.cardProduto, adicionadoAgora && styles.cardProdutoAtivo]}>
            <View style={styles.imagemPlaceholder}>
              <Image source={produto.imagem} style={styles.imagemProduto} resizeMode="cover" />
            </View>

            <View style={styles.infoProduto}>
              <Text style={styles.nomeProduto}>{produto.nome}</Text>
              <Text style={styles.descricaoProduto}>{produto.descricao}</Text>
              <Text style={styles.valorProduto}>{produto.valor}</Text>
              {adicionadoAgora && <Text style={styles.feedbackItem}>Adicionado ao carrinho</Text>}
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
          </View>
          );
        })}
      </ScrollView>

      <Animated.View pointerEvents="none" style={[styles.toastContainer, estiloToastAnimado]}>
        <View style={styles.toastLinha}>
          <View style={styles.toastIconeWrap}>
            <Text style={styles.toastIcone}>✓</Text>
          </View>
          <Text style={styles.toastTexto}>{mensagemToast}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BBBBBB',
  },
  topo: {
    backgroundColor: '#AD395A',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingTop: 18,
    paddingHorizontal: 14,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: 0.2,
  },
  subtitulo: {
    marginTop: 1,
    color: '#F9E5EC',
    fontSize: 15,
    fontWeight: '500',
  },
  botaoPerfil: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E4E4E4',
    borderWidth: 1,
    borderColor: '#D4D4D4',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagemPerfil: {
    width: '100%',
    height: '100%',
  },
  tituloCardapio: {
    marginTop: 12,
    marginHorizontal: 12,
    marginBottom: 4,
    color: '#434343',
    fontSize: 36,
    fontWeight: '700',
  },
  categoriasScroll: {
    flexGrow: 0,
    maxHeight: 48,
    marginTop: 0,
  },
  listaCategorias: {
    paddingHorizontal: 8,
    paddingBottom: 6,
    paddingRight: 8,
  },
  chipCategoria: {
    marginTop: 4,
    backgroundColor: '#EAEAEA',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CECECE',
    width: 92,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipCategoriaComEspaco: {
    marginRight: 7,
  },
  chipCategoriaAtivo: {
    backgroundColor: '#B03A5A',
    borderColor: '#B03A5A',
  },
  textoChip: {
    color: '#3B3B3B',
    fontSize: 13,
    fontWeight: '600',
  },
  textoChipAtivo: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listaProdutos: {
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 18,
    gap: 10,
  },
  cardProduto: {
    backgroundColor: '#EBEBEB',
    minHeight: 96,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#929292',
    padding: 9,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardProdutoAtivo: {
    borderColor: '#4B8941',
    backgroundColor: '#E6F3E3',
  },
  imagemPlaceholder: {
    width: 76,
    height: 76,
    borderRadius: 14,
    backgroundColor: '#3A3A3A',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagemProduto: {
    width: '100%',
    height: '100%',
  },
  infoProduto: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  nomeProduto: {
    color: '#1E1E1E',
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '700',
  },
  descricaoProduto: {
    color: '#4B4B4B',
    fontSize: 14,
    marginTop: 2,
    lineHeight: 17,
  },
  valorProduto: {
    color: '#2A2A2A',
    fontSize: 16,
    marginTop: 4,
    lineHeight: 18,
    fontWeight: '700',
  },
  feedbackItem: {
    marginTop: 3,
    color: '#2F7C47',
    fontSize: 12,
    fontWeight: '700',
  },
  botaoAdicionar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#55983E',
    borderWidth: 1,
    borderColor: '#4F833D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoAdicionarAtivo: {
    backgroundColor: '#2F7C47',
    borderColor: '#2B6D3F',
  },
  textoAdicionar: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginTop: -1,
  },
  toastContainer: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 22,
    minHeight: 50,
    borderRadius: 16,
    backgroundColor: '#1F5C3A',
    borderWidth: 1,
    borderColor: '#2B7A4C',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    zIndex: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.24,
    shadowRadius: 10,
    elevation: 8,
  },
  toastLinha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toastIconeWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2D8755',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },
  toastIcone: {
    color: '#F2FFF6',
    fontSize: 13,
    fontWeight: '800',
  },
  toastTexto: {
    color: '#F6FFF8',
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
});