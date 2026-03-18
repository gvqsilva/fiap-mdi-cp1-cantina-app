import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from './cart-context';

const IMAGEM_PRODUTO = require('../assets/splash-icon.png');
const OPCOES_PAGAMENTO = ['Debito', 'Credito', 'Vale Refeicao', 'Pix'];

function valorParaNumero(valor) {
  if (typeof valor !== 'string') {
    return 0;
  }

  const apenasNumeros = valor.replace(/[^\d,]/g, '').replace(',', '.');
  const numero = Number(apenasNumeros);

  if (Number.isNaN(numero)) {
    return 0;
  }

  return numero;
}

export default function Pagamento() {
  const router = useRouter();
  const { itens, totalItens } = useCart();
  const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);
  const podeFinalizar = Boolean(opcaoSelecionada) && totalItens > 0;

  const subtotal = itens.reduce((acumulado, item) => {
    return acumulado + valorParaNumero(item.valor) * item.quantidade;
  }, 0);

  const total = subtotal;

  return (
    <View style={styles.container}>
      <View style={styles.topo}>
        <Text style={styles.titulo}>Pagamento</Text>
        <Text style={styles.subtitulo}>Confira os dados antes de concluir</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.conteudo}>
        <View style={styles.blocoResumo}>
          <Text style={styles.resumoTitulo}>Resumo do pedido</Text>

          <View style={styles.listaProdutos}>
            {itens.map((item) => (
              <View key={item.id} style={styles.itemProduto}>
                <View style={styles.imagemItemWrap}>
                  <Image source={IMAGEM_PRODUTO} style={styles.imagemItem} resizeMode="cover" />
                </View>

                <View style={styles.infoProduto}>
                  <Text style={styles.nomeProduto}>{item.nome}</Text>
                  <Text style={styles.valorProduto}>{item.valor}</Text>
                </View>

                <Text style={styles.quantidadeProduto}>{item.quantidade}</Text>
              </View>
            ))}
          </View>

          <View style={styles.linhaResumo}>
            <Text style={styles.labelResumo}>Itens</Text>
            <Text style={styles.valorResumo}>{totalItens}</Text>
          </View>

          <View style={styles.linhaResumo}>
            <Text style={styles.labelResumo}>Subtotal</Text>
            <Text style={styles.valorResumo}>{`R$ ${subtotal.toFixed(2).replace('.', ',')}`}</Text>
          </View>

          <View style={[styles.linhaResumo, styles.linhaTotal]}>
            <Text style={styles.labelTotal}>Total</Text>
            <Text style={styles.valorTotal}>{`R$ ${total.toFixed(2).replace('.', ',')}`}</Text>
          </View>
        </View>

        <View style={styles.blocoPagamento}>
          <Text style={styles.tituloPagamento}>Formas de pagamento</Text>

          {OPCOES_PAGAMENTO.map((opcao) => {
            const ativa = opcaoSelecionada === opcao;

            return (
              <TouchableOpacity
                key={opcao}
                style={[styles.botaoOpcao, ativa && styles.botaoOpcaoAtiva]}
                activeOpacity={0.85}
                onPress={() => setOpcaoSelecionada(opcao)}
              >
                <Text style={[styles.textoOpcao, ativa && styles.textoOpcaoAtiva]}>{opcao}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.rodapeAcoes}>
        <TouchableOpacity style={styles.botaoSecundario} onPress={() => router.back()} activeOpacity={0.85}>
          <Text style={styles.textoBotaoSecundario}>Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botaoPrincipal, !podeFinalizar && styles.botaoPrincipalDesabilitado]}
          activeOpacity={0.85}
          disabled={!podeFinalizar}
          onPress={() =>
            router.push({
              pathname: '/processando-pagamento',
              params: {
                formaPagamento: opcaoSelecionada,
                flowId: String(Date.now()),
              },
            })
          }
        >
          <Text style={styles.textoBotaoPrincipal}>Finalizar pagamento</Text>
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
    paddingHorizontal: 10,
    paddingBottom: 12,
  },
  titulo: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 38,
  },
  subtitulo: {
    color: '#FFF1F5',
    fontSize: 16,
    marginTop: 4,
  },
  conteudo: {
    paddingBottom: 10,
  },
  blocoResumo: {
    marginTop: 16,
    marginHorizontal: 8,
    borderRadius: 18,
    backgroundColor: '#E6E6E6',
    borderWidth: 1,
    borderColor: '#8A8A8A',
    padding: 12,
  },
  blocoPagamento: {
    marginTop: 10,
    marginHorizontal: 8,
    marginBottom: 6,
    borderRadius: 16,
    backgroundColor: '#B8B8B8',
    borderWidth: 1,
    borderColor: '#8E8E8E',
    padding: 10,
  },
  tituloPagamento: {
    color: '#2C2C2C',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  botaoOpcao: {
    minHeight: 42,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#C8C8C8',
    backgroundColor: '#ECECEC',
    justifyContent: 'center',
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  botaoOpcaoAtiva: {
    backgroundColor: '#B03A5A',
    borderColor: '#B03A5A',
  },
  textoOpcao: {
    color: '#2E2E2E',
    fontSize: 18,
    fontWeight: '600',
  },
  textoOpcaoAtiva: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  resumoTitulo: {
    color: '#252525',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
  },
  listaProdutos: {
    marginBottom: 10,
    gap: 6,
  },
  itemProduto: {
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: '#D1D1D1',
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imagemItemWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#3A3A3A',
  },
  imagemItem: {
    width: '100%',
    height: '100%',
  },
  infoProduto: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
  },
  nomeProduto: {
    color: '#2A2A2A',
    fontSize: 15,
    fontWeight: '600',
  },
  valorProduto: {
    color: '#3E3E3E',
    fontSize: 13,
    marginTop: -1,
  },
  quantidadeProduto: {
    color: '#2A2A2A',
    fontSize: 16,
    fontWeight: '700',
    minWidth: 16,
    textAlign: 'right',
  },
  linhaResumo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  linhaTotal: {
    borderTopWidth: 1,
    borderTopColor: '#BEBEBE',
    marginTop: 4,
    paddingTop: 10,
    marginBottom: 0,
  },
  labelResumo: {
    color: '#424242',
    fontSize: 16,
  },
  valorResumo: {
    color: '#1F1F1F',
    fontSize: 16,
    fontWeight: '600',
  },
  labelTotal: {
    color: '#171717',
    fontSize: 20,
    fontWeight: '700',
  },
  valorTotal: {
    color: '#171717',
    fontSize: 20,
    fontWeight: '700',
  },
  rodapeAcoes: {
    marginTop: 'auto',
    paddingHorizontal: 8,
    paddingBottom: 16,
    gap: 8,
  },
  botaoSecundario: {
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: '#B03A5A',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAD2DA',
  },
  textoBotaoSecundario: {
    color: '#6B2940',
    fontSize: 18,
    fontWeight: '600',
  },
  botaoPrincipal: {
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B03A5A',
  },
  botaoPrincipalDesabilitado: {
    backgroundColor: '#8B6B74',
  },
  textoBotaoPrincipal: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
});
