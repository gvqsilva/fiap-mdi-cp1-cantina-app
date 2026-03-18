import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from './cart-context';

const IMAGEM_PRODUTO = require('../assets/splash-icon.png');

export default function Carrinho() {
  const router = useRouter();
  const { itens, aumentarQuantidade, diminuirQuantidade } = useCart();
  const carrinhoVazio = itens.length === 0;

  return (
    <View style={styles.container}>
      <View style={styles.topo}>
        <Text style={styles.titulo}>Carrinho</Text>
        <Text style={styles.subtitulo}>Verifique seu pedido antes de finalizar a compra</Text>
      </View>

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
                <Image source={IMAGEM_PRODUTO} style={styles.imagemProduto} resizeMode="cover" />
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
    backgroundColor: '#A5A5A5',
  },
  topo: {
    backgroundColor: '#AD395A',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 8,
    paddingBottom: 10,
  },
  titulo: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 38,
  },
  subtitulo: {
    color: '#FFF1F5',
    fontSize: 29,
    lineHeight: 31,
    marginTop: 4,
    fontWeight: '400',
  },
  listaItens: {
    paddingHorizontal: 4,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 8,
  },
  estadoVazio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  tituloVazio: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtituloVazio: {
    marginTop: 8,
    color: '#F2F2F2',
    fontSize: 16,
    textAlign: 'center',
  },
  cardItem: {
    backgroundColor: '#D9D9D9',
    borderWidth: 1,
    borderColor: '#8A8A8A',
    borderRadius: 16,
    minHeight: 90,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  imagemWrapper: {
    width: 72,
    height: 72,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#3A3A3A',
  },
  imagemProduto: {
    width: '100%',
    height: '100%',
  },
  infoItem: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
  },
  nomeItem: {
    color: '#1F1F1F',
    fontSize: 39,
    lineHeight: 40,
    fontWeight: '400',
  },
  descricaoItem: {
    color: '#2C2C2C',
    fontSize: 21,
    lineHeight: 23,
    marginTop: -2,
  },
  valorItem: {
    color: '#2C2C2C',
    fontSize: 21,
    lineHeight: 23,
    marginTop: -2,
  },
  quantidadeContainer: {
    minWidth: 108,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoQuantidade: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoDiminuir: {
    backgroundColor: '#B34747',
  },
  botaoAumentar: {
    backgroundColor: '#55983E',
  },
  quantidadeTexto: {
    color: '#0F0F0F',
    fontSize: 30,
    lineHeight: 32,
    fontWeight: '400',
    marginHorizontal: 8,
    minWidth: 24,
    textAlign: 'center',
  },
  textoBotaoQuantidade: {
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 22,
    fontWeight: '700',
  },
  rodapeAcao: {
    marginTop: 'auto',
    paddingHorizontal: 0,
    paddingBottom: 10,
  },
  botaoPagamento: {
    height: 38,
    borderRadius: 19,
    backgroundColor: '#B03A5A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoPagamentoDesabilitado: {
    backgroundColor: '#8B6B74',
  },
  botaoPagamentoTexto: {
    color: '#FFFFFF',
    fontSize: 36,
    lineHeight: 36,
    fontWeight: '700',
  },
});