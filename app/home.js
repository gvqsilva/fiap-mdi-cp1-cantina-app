import { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useCart } from './cart-context';

const CATEGORIAS = ['Tudo', 'Salgado', 'Doce', 'Bebidas', 'Combos'];
const IMAGEM_PERFIL = require('../assets/icon.png');
const IMAGEM_PRODUTO = require('../assets/splash-icon.png');

const PRODUTOS = [
  { id: 1, nome: 'Produto 1', descricao: 'breve descrição', valor: 'R$ 8,00', categoria: 'Salgado' },
  { id: 2, nome: 'Produto 2', descricao: 'breve descrição', valor: 'R$ 6,50', categoria: 'Doce' },
  { id: 3, nome: 'Produto 3', descricao: 'breve descrição', valor: 'R$ 5,00', categoria: 'Bebidas' },
  { id: 4, nome: 'Produto 4', descricao: 'breve descrição', valor: 'R$ 12,00', categoria: 'Combos' },
  { id: 5, nome: 'Produto 5', descricao: 'breve descrição', valor: 'R$ 7,00', categoria: 'Salgado' },
  { id: 6, nome: 'Produto 6', descricao: 'breve descrição', valor: 'R$ 9,00', categoria: 'Doce' },
  { id: 7, nome: 'Produto 7', descricao: 'breve descrição', valor: 'R$ 15,00', categoria: 'Combos' },
  { id: 8, nome: 'Produto 8', descricao: 'breve descrição', valor: 'R$ 6,00', categoria: 'Bebidas' },
  { id: 9, nome: 'Produto 9', descricao: 'breve descrição', valor: 'R$ 8,00', categoria: 'Salgado' },
  { id: 10, nome: 'Produto 10', descricao: 'breve descrição', valor: 'R$ 11,00', categoria: 'Doce' },
];

export default function Home() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Tudo');
  const { adicionarItem } = useCart();

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

        <TouchableOpacity style={styles.botaoPerfil} activeOpacity={0.85}>
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
        {produtosFiltrados.map((produto) => (
          <View key={produto.id} style={styles.cardProduto}>
            <View style={styles.imagemPlaceholder}>
              <Image source={IMAGEM_PRODUTO} style={styles.imagemProduto} resizeMode="cover" />
            </View>

            <View style={styles.infoProduto}>
              <Text style={styles.nomeProduto}>{produto.nome}</Text>
              <Text style={styles.descricaoProduto}>{produto.descricao}</Text>
              <Text style={styles.valorProduto}>{produto.valor}</Text>
            </View>

            <TouchableOpacity
              style={styles.botaoAdicionar}
              activeOpacity={0.8}
              onPress={() => adicionarItem(produto)}
            >
              <Text style={styles.textoAdicionar}>+</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
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
  textoAdicionar: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginTop: -1,
  },
});