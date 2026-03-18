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
    backgroundColor: '#CFCFCF',
  },
  topo: {
    backgroundColor: '#AD395A',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 37,
  },
  subtitulo: {
    marginTop: 2,
    color: '#F2D4DD',
    fontSize: 16,
    fontWeight: '500',
  },
  botaoPerfil: {
    width: 68,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E4E4E4',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagemPerfil: {
    width: '100%',
    height: '100%',
  },
  tituloCardapio: {
    marginTop: 10,
    marginHorizontal: 10,
    marginBottom: 2,
    color: '#565656',
    fontSize: 34,
    fontWeight: '700',
  },
  categoriasScroll: {
    flexGrow: 0,
    maxHeight: 46,
    marginTop: 0,
  },
  listaCategorias: {
    paddingHorizontal: 6,
    paddingBottom: 4,
    paddingRight: 6,
  },
  chipCategoria: {
    marginTop: 4,
    backgroundColor: '#E3E3E3',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#D1D1D1',
    width: 86,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipCategoriaComEspaco: {
    marginRight: 6,
  },
  chipCategoriaAtivo: {
    backgroundColor: '#B03A5A',
    borderColor: '#B03A5A',
  },
  textoChip: {
    color: '#3F3F3F',
    fontSize: 14,
    fontWeight: '600',
  },
  textoChipAtivo: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listaProdutos: {
    paddingHorizontal: 4,
    paddingTop: 2,
    paddingBottom: 16,
    gap: 8,
  },
  cardProduto: {
    backgroundColor: '#E8E8E8',
    minHeight: 88,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#8A8A8A',
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imagemPlaceholder: {
    width: 72,
    height: 72,
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
    marginLeft: 10,
    marginRight: 8,
  },
  nomeProduto: {
    color: '#1E1E1E',
    fontSize: 34,
    lineHeight: 34,
    fontWeight: '400',
  },
  descricaoProduto: {
    color: '#2D2D2D',
    fontSize: 24,
    marginTop: -2,
    lineHeight: 26,
  },
  valorProduto: {
    color: '#2A2A2A',
    fontSize: 22,
    marginTop: -2,
    lineHeight: 24,
  },
  botaoAdicionar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#55983E',
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