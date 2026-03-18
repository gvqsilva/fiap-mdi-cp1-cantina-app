import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useCart } from './cart-context';

function formatarData(dataIso) {
  const data = new Date(dataIso);

  return data.toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatarValor(valor) {
  return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

export default function Perfil() {
  const { historicoPedidos } = useCart();
  const [pedidoExpandido, setPedidoExpandido] = useState(null);
  const semHistorico = historicoPedidos.length === 0;

  const alternarExpansaoPedido = (chavePedido) => {
    setPedidoExpandido((atual) => (atual === chavePedido ? null : chavePedido));
  };

  return (
    <View style={styles.container}>
      <View style={styles.topo}>
        <View style={styles.linhaTopo}>
          <Text style={styles.titulo}>Perfil</Text>

          <View style={styles.infoAluno}>
            <Text style={styles.textoAluno}>Olá, Gabriel</Text>
            <Text style={styles.textoTurma}>Turma</Text>
          </View>
        </View>

        <Text style={styles.subtitulo}>Histórico de pedidos</Text>
      </View>

      {semHistorico ? (
        <View style={styles.estadoVazio}>
          <Text style={styles.tituloVazio}>Nenhum pedido encontrado</Text>
          <Text style={styles.subtituloVazio}>Quando voce concluir uma compra, ela aparecera aqui.</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listaPedidos}>
          {historicoPedidos.map((pedido) => {
            const statusConcluido = pedido.status === 'Concluído';
            const statusRetirada = pedido.status === 'Pronto para retirada';
            const chavePedido = `${pedido.id}-${pedido.data}`;
            const estaExpandido = pedidoExpandido === chavePedido;
            const itensPedido = Array.isArray(pedido.itens) ? pedido.itens : [];

            return (
              <TouchableOpacity
                key={chavePedido}
                style={styles.cardPedido}
                activeOpacity={0.9}
                onPress={() => alternarExpansaoPedido(chavePedido)}
              >
                <View style={styles.linhaCabecalhoCard}>
                  <Text style={styles.idPedido}>{`Pedido ${pedido.id}`}</Text>
                  <View style={styles.cabecalhoAcoes}>
                    <View
                      style={[
                        styles.badgeStatus,
                        statusConcluido && styles.badgeConcluido,
                        statusRetirada && styles.badgeRetirada,
                      ]}
                    >
                      <Text style={styles.textoStatus}>{pedido.status}</Text>
                    </View>
                    <Text style={styles.iconeExpandir}>{estaExpandido ? '▴' : '▾'}</Text>
                  </View>
                </View>

                <View style={styles.linhaInfo}>
                  <Text style={styles.label}>Data</Text>
                  <Text style={styles.valor}>{formatarData(pedido.data)}</Text>
                </View>

                <View style={styles.linhaInfo}>
                  <Text style={styles.label}>Itens</Text>
                  <Text style={styles.valor}>{pedido.totalItens}</Text>
                </View>

                <View style={styles.linhaInfo}>
                  <Text style={styles.label}>Valor</Text>
                  <Text style={styles.valor}>{formatarValor(pedido.totalValor)}</Text>
                </View>

                {estaExpandido && (
                  <View style={styles.secaoDetalhes}>
                    <Text style={styles.tituloDetalhes}>Detalhes do pedido</Text>

                    {itensPedido.map((item) => (
                      <View key={`${chavePedido}-${item.id}`} style={styles.itemDetalhe}>
                        <Text style={styles.nomeDetalheItem}>{item.nome}</Text>

                        <View style={styles.linhaDetalheInfo}>
                          <Text style={styles.labelDetalhe}>Valor unit.</Text>
                          <Text style={styles.valorDetalhe}>{item.valor}</Text>
                        </View>

                        <View style={styles.linhaDetalheInfo}>
                          <Text style={styles.labelDetalhe}>Qtd</Text>
                          <Text style={styles.valorDetalhe}>{item.quantidade}</Text>
                        </View>

                        <View style={styles.linhaDetalheInfo}>
                          <Text style={styles.labelDetalhe}>Subtotal</Text>
                          <Text style={styles.valorDetalhe}>{formatarValor(item.subtotal || 0)}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
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
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 36,
  },
  linhaTopo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  infoAluno: {
    alignItems: 'flex-end',
    marginTop: 2,
  },
  textoAluno: {
    color: '#FDECF2',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
  },
  textoTurma: {
    marginTop: -1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 18,
  },
  subtitulo: {
    marginTop: 6,
    color: '#F6DEE7',
    fontSize: 16,
    fontWeight: '500',
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
    marginTop: 8,
    color: '#EFEFEF',
    fontSize: 16,
    textAlign: 'center',
  },
  listaPedidos: {
    paddingTop: 12,
    paddingHorizontal: 8,
    paddingBottom: 16,
    gap: 10,
  },
  cardPedido: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#8D8D8D',
    backgroundColor: '#E1E1E1',
    padding: 12,
  },
  linhaCabecalhoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 8,
  },
  cabecalhoAcoes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  idPedido: {
    color: '#1E1E1E',
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  badgeStatus: {
    minHeight: 28,
    borderRadius: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D9B57C',
  },
  badgeConcluido: {
    backgroundColor: '#5C9E4A',
  },
  badgeRetirada: {
    backgroundColor: '#3A87AD',
  },
  textoStatus: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  iconeExpandir: {
    color: '#6A2A41',
    fontSize: 18,
    fontWeight: '700',
    minWidth: 14,
    textAlign: 'center',
  },
  linhaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    color: '#4D4D4D',
    fontSize: 15,
    fontWeight: '500',
  },
  valor: {
    color: '#1E1E1E',
    fontSize: 15,
    fontWeight: '700',
  },
  secaoDetalhes: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#B9B9B9',
    paddingTop: 10,
    gap: 8,
  },
  tituloDetalhes: {
    color: '#303030',
    fontSize: 15,
    fontWeight: '700',
  },
  itemDetalhe: {
    backgroundColor: '#D5D5D5',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  nomeDetalheItem: {
    color: '#242424',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 5,
  },
  linhaDetalheInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  labelDetalhe: {
    color: '#4B4B4B',
    fontSize: 13,
    fontWeight: '500',
  },
  valorDetalhe: {
    color: '#222222',
    fontSize: 13,
    fontWeight: '700',
  },
});