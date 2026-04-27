import { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from './cart-context';
import { useAuth } from './auth-context';
import ThemedHeader from '../components/ThemedHeader';
import PrimaryButton from '../components/PrimaryButton';
import ScreenBackground from '../components/ScreenBackground';
import FadeInView from '../components/FadeInView';
import { theme } from './theme';

const IMAGEM_PADRAO = require('../assets/splash-icon.png');
const OPCOES_PAGAMENTO = ['Débito', 'Crédito', 'Vale Refeição', 'Pix'];
const HORA_ABERTURA = 7;
const HORA_FECHAMENTO = 21;

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
  const { itens, totalItens, historicoPedidos } = useCart();
  const { usuarioLogado } = useAuth();
  const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);

  const subtotal = itens.reduce((acumulado, item) => {
    return acumulado + valorParaNumero(item.valor) * item.quantidade;
  }, 0);

  const agora = new Date();
  const horaAtual = agora.getHours();
  const dentroHorario = horaAtual >= HORA_ABERTURA && horaAtual < HORA_FECHAMENTO;

  const ehProfessor = usuarioLogado?.papel === 'professor';
  const pedidosParaDesconto = ehProfessor ? 5 : 10;

  const pedidosConcluidos = historicoPedidos.filter((pedido) => pedido.status === 'Concluído').length;
  const progressoFidelidade = pedidosConcluidos % pedidosParaDesconto;
  const vaiGanharFidelidade = progressoFidelidade === pedidosParaDesconto - 1;
  const descontoFidelidade = vaiGanharFidelidade ? subtotal * 0.1 : 0;

  const descontoTotal = Math.min(subtotal * 0.5, descontoFidelidade);
  const total = Math.max(0, subtotal - descontoTotal);
  const podeFinalizar = Boolean(opcaoSelecionada) && totalItens > 0 && dentroHorario;

  return (
    <View style={styles.container}>
      <ScreenBackground />
      <ThemedHeader title="Pagamento" subtitle="Confira os dados antes de concluir" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.conteudo}>
        <FadeInView style={styles.blocoResumo}>
          <Text style={styles.resumoTitulo}>Resumo do pedido</Text>

          <View style={styles.listaProdutos}>
            {itens.map((item) => (
              <View key={item.id} style={styles.itemProduto}>
                <View style={styles.imagemItemWrap}>
                  <Image source={item.imagem || IMAGEM_PADRAO} style={styles.imagemItem} resizeMode="cover" />
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

          <View style={styles.linhaResumo}>
            <Text style={styles.labelResumo}>Descontos</Text>
            <Text style={styles.valorResumo}>{`- R$ ${descontoTotal.toFixed(2).replace('.', ',')}`}</Text>
          </View>

          <View style={[styles.linhaResumo, styles.linhaTotal]}>
            <Text style={styles.labelTotal}>Total</Text>
            <Text style={styles.valorTotal}>{`R$ ${total.toFixed(2).replace('.', ',')}`}</Text>
          </View>

          <Text style={styles.textoFidelidade}>{`Fidelidade automática: ${progressoFidelidade}/${pedidosParaDesconto} pedidos concluídos`}</Text>
          {vaiGanharFidelidade ? (
            <Text style={styles.alertaFidelidade}>
              {`Você já está com direito ao desconto de 10% no próximo pedido.`}
            </Text>
          ) : (
            <Text style={styles.alertaFidelidade}>
              {ehProfessor
                ? 'Professor: 10% a cada 5 pedidos concluídos.'
                : 'Aluno: 10% a cada 10 pedidos concluídos.'}
            </Text>
          )}
        </FadeInView>

        <FadeInView style={styles.blocoPagamento} delay={80}>
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

          {!dentroHorario ? (
            <Text style={styles.erroCupom}>{`Pedidos disponíveis somente das ${HORA_ABERTURA}h às ${HORA_FECHAMENTO}h`}</Text>
          ) : null}
        </FadeInView>
      </ScrollView>

      <FadeInView style={styles.rodapeAcoes} delay={120}>
        <PrimaryButton title="Voltar" variant="secondary" onPress={() => router.back()} />

        <PrimaryButton
          title="Finalizar pagamento"
          disabled={!podeFinalizar}
          onPress={() =>
            router.push({
              pathname: '/processando-pagamento',
              params: {
                formaPagamento: opcaoSelecionada,
                flowId: String(Date.now()),
                desconto: descontoTotal.toFixed(2),
                totalFinal: total.toFixed(2),
              },
            })
          }
        />
      </FadeInView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  conteudo: {
    paddingBottom: 10,
  },
  blocoResumo: {
    marginTop: 16,
    marginHorizontal: 10,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 12,
    ...theme.shadow,
  },
  blocoPagamento: {
    marginTop: 10,
    marginHorizontal: 10,
    marginBottom: 6,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 10,
    ...theme.shadow,
  },
  tituloPagamento: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  botaoOpcao: {
    minHeight: 42,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#0E0E0E',
    justifyContent: 'center',
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  botaoOpcaoAtiva: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accentStrong,
    ...theme.glow,
  },
  textoOpcao: {
    color: theme.colors.textMuted,
    fontSize: 18,
    fontWeight: '600',
  },
  textoOpcaoAtiva: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  erroCupom: {
    color: '#FF7D7D',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  resumoTitulo: {
    color: theme.colors.text,
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
    backgroundColor: '#0D0D0D',
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#202020',
  },
  imagemItemWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#050505',
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
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  valorProduto: {
    color: theme.colors.textMuted,
    fontSize: 13,
    marginTop: -1,
  },
  quantidadeProduto: {
    color: theme.colors.text,
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
    borderTopColor: theme.colors.border,
    marginTop: 4,
    paddingTop: 10,
    marginBottom: 0,
  },
  labelResumo: {
    color: theme.colors.textMuted,
    fontSize: 16,
  },
  valorResumo: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  labelTotal: {
    color: theme.colors.accentSoft,
    fontSize: 20,
    fontWeight: '700',
  },
  valorTotal: {
    color: theme.colors.accentSoft,
    fontSize: 20,
    fontWeight: '700',
  },
  textoFidelidade: {
    marginTop: 8,
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  alertaFidelidade: {
    marginTop: 4,
    color: '#8BE2AE',
    fontSize: 13,
    fontWeight: '700',
  },
  rodapeAcoes: {
    marginTop: 'auto',
    paddingHorizontal: 10,
    paddingBottom: 16,
    gap: 8,
  },
});
