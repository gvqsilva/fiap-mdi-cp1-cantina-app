import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useCart } from './cart-context';
import { useAuth } from './auth-context';
import ThemedHeader from '../components/ThemedHeader';
import ScreenBackground from '../components/ScreenBackground';
import FadeInView from '../components/FadeInView';
import PrimaryButton from '../components/PrimaryButton';
import { theme } from './theme';

const FILTRO_TODOS = 'todos';
const FILTRO_ANDAMENTO = 'andamento';
const FILTRO_CONCLUIDOS = 'concluidos';
const FILTROS = [
  { id: FILTRO_TODOS, label: 'Todos' },
  { id: FILTRO_ANDAMENTO, label: 'Em andamento' },
  { id: FILTRO_CONCLUIDOS, label: 'Concluídos' },
];

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
  return `R$ ${Number(valor || 0).toFixed(2).replace('.', ',')}`;
}

function formatarChaveData(dataIso) {
  const data = new Date(dataIso);
  return data.toISOString().slice(0, 10);
}

function formatarTituloSecao(dataIso) {
  const data = new Date(dataIso);
  const hoje = new Date();
  const ontem = new Date();
  ontem.setDate(hoje.getDate() - 1);
  const chave = formatarChaveData(dataIso);

  if (chave === formatarChaveData(hoje.toISOString())) {
    return 'Hoje';
  }

  if (chave === formatarChaveData(ontem.toISOString())) {
    return 'Ontem';
  }

  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function calcularTempoRestante(pedido) {
  const agora = new Date();

  if (pedido.status === 'Em preparação' && pedido.previsaoPronto) {
    const diffMs = new Date(pedido.previsaoPronto).getTime() - agora.getTime();
    if (diffMs <= 0) {
      return 'Atualizando status...';
    }

    const minutos = Math.max(1, Math.ceil(diffMs / 60000));
    return `${minutos} min para ficar pronto`;
  }

  if (pedido.status === 'Pronto para retirada' && pedido.previsaoConcluido) {
    const diffMs = new Date(pedido.previsaoConcluido).getTime() - agora.getTime();
    if (diffMs <= 0) {
      return 'Finalizando pedido...';
    }

    const minutos = Math.max(1, Math.ceil(diffMs / 60000));
    return `${minutos} min para concluir`;
  }

  return 'Pedido concluído';
}

function indiceTimeline(status) {
  if (status === 'Concluído') {
    return 2;
  }

  if (status === 'Pronto para retirada') {
    return 1;
  }

  return 0;
}

function StepTimeline({ status }) {
  const indiceAtual = indiceTimeline(status);

  return (
    <View style={styles.timelineWrap}>
      {['Em preparo', 'Pronto', 'Concluído'].map((etapa, index) => {
        const ativo = index <= indiceAtual;
        const ultima = index === 2;

        return (
          <View key={etapa} style={styles.timelineItem}>
            <View style={[styles.timelinePonto, ativo && styles.timelinePontoAtivo]} />
            <Text style={[styles.timelineTexto, ativo && styles.timelineTextoAtivo]}>{etapa}</Text>
            {!ultima ? <View style={[styles.timelineLinha, index < indiceAtual && styles.timelineLinhaAtiva]} /> : null}
          </View>
        );
      })}
    </View>
  );
}

export default function Perfil() {
  const { historicoPedidos } = useCart();
  const { usuarioLogado, logout } = useAuth();
  const [pedidoExpandido, setPedidoExpandido] = useState(null);
  const [filtroSelecionado, setFiltroSelecionado] = useState(FILTRO_TODOS);
  const [buscaPedido, setBuscaPedido] = useState('');
  const ehProfessor = usuarioLogado?.papel === 'professor';
  const etiquetaPerfil = ehProfessor ? 'Professor' : 'Aluno';
  const nomeUsuario = String(usuarioLogado?.nome || 'Usuário').trim();
  const primeiroNome = nomeUsuario.split(' ')[0] || 'Usuário';
  const inicialUsuario = primeiroNome.charAt(0).toUpperCase();
  const pedidosParaDesconto = ehProfessor ? 5 : 10;
  const pedidosConcluidos = historicoPedidos.filter((pedido) => pedido.status === 'Concluído').length;
  const progressoFidelidade = pedidosConcluidos % pedidosParaDesconto;
  const pedidosRestantes = pedidosParaDesconto - progressoFidelidade;

  const pedidosFiltrados = useMemo(() => {
    return historicoPedidos.filter((pedido) => {
      const statusConcluido = pedido.status === 'Concluído';

      if (filtroSelecionado === FILTRO_ANDAMENTO && statusConcluido) {
        return false;
      }

      if (filtroSelecionado === FILTRO_CONCLUIDOS && !statusConcluido) {
        return false;
      }

      const termo = buscaPedido.trim().toLowerCase();
      if (!termo) {
        return true;
      }

      const idTexto = String(pedido.id || '').toLowerCase();
      return idTexto.includes(termo);
    });
  }, [buscaPedido, filtroSelecionado, historicoPedidos]);

  const secoesPedidos = useMemo(() => {
    const agrupado = pedidosFiltrados.reduce((acc, pedido) => {
      const chave = formatarChaveData(pedido.data);
      if (!acc[chave]) {
        acc[chave] = [];
      }
      acc[chave].push(pedido);
      return acc;
    }, {});

    return Object.keys(agrupado)
      .sort((a, b) => (a < b ? 1 : -1))
      .map((chave) => ({
        chave,
        titulo: formatarTituloSecao(`${chave}T12:00:00.000Z`),
        pedidos: agrupado[chave],
      }));
  }, [pedidosFiltrados]);

  const semHistorico = pedidosFiltrados.length === 0;

  const alternarExpansaoPedido = (chavePedido) => {
    setPedidoExpandido((atual) => (atual === chavePedido ? null : chavePedido));
  };

  return (
    <View style={styles.container}>
      <ScreenBackground />
      <ThemedHeader
        title="Perfil"
        subtitle="Histórico de pedidos"
      />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
        <FadeInView style={styles.heroPerfil} delay={35}>
        <View style={styles.avatarPerfil}>
          <Text style={styles.avatarTexto}>{inicialUsuario}</Text>
        </View>

        <View style={styles.heroInfoPerfil}>
          <Text style={styles.heroTituloPerfil}>{`Olá, ${primeiroNome}`}</Text>
          <Text style={styles.heroSubtituloPerfil}>{usuarioLogado?.email || '-'}</Text>
          <View style={[styles.badgePerfil, ehProfessor ? styles.badgeProfessor : styles.badgeAluno]}>
            <Text style={styles.textoBadgePerfil}>{etiquetaPerfil}</Text>
          </View>
        </View>
      </FadeInView>

      <FadeInView style={styles.blocoPerfil} delay={50}>
        <View style={styles.cabecalhoPerfil}>
          <Text style={styles.tituloSecao}>Dados pessoais</Text>
          <Text style={styles.subtituloCard}>Informações da conta</Text>
        </View>

        <View style={styles.gridDadosPerfil}>
          <View style={styles.cardDadoPerfil}>
            <Text style={styles.labelPerfil}>E-mail</Text>
            <Text style={styles.valorPerfil}>{usuarioLogado?.email || '-'}</Text>
          </View>

          {ehProfessor ? (
            <View style={styles.cardDadoPerfil}>
              <Text style={styles.labelPerfil}>Código do professor</Text>
              <Text style={styles.valorPerfil}>{usuarioLogado?.professorId || '-'}</Text>
            </View>
          ) : (
            <>
              <View style={styles.cardDadoPerfil}>
                <Text style={styles.labelPerfil}>RM</Text>
                <Text style={styles.valorPerfil}>{usuarioLogado?.rm || '-'}</Text>
              </View>

              <View style={styles.cardDadoPerfil}>
                <Text style={styles.labelPerfil}>Turma</Text>
                <Text style={styles.valorPerfil}>{usuarioLogado?.turma || '-'}</Text>
              </View>
            </>
          )}
        </View>

        {ehProfessor ? (
          <>
            <Text style={styles.tituloBeneficios}>Benefícios do professor</Text>
            <View style={styles.linhaBeneficio}>
              <View style={styles.iconeBeneficioWrap}>
                <Text style={styles.iconeBeneficio}>✓</Text>
              </View>
              <Text style={styles.itemBeneficio}>30% de redução no tempo de preparo</Text>
            </View>
            <View style={styles.linhaBeneficio}>
              <View style={styles.iconeBeneficioWrap}>
                <Text style={styles.iconeBeneficio}>✓</Text>
              </View>
              <Text style={styles.itemBeneficio}>1 desconto de 10% a cada 5 pedidos concluídos</Text>
            </View>
          </>
        ) : (
          <View style={styles.fidelidadeBox}>
            <Text style={styles.labelFidelidade}>Fidelidade</Text>
            <Text style={styles.valorFidelidade}>{`${progressoFidelidade}/${pedidosParaDesconto} pedidos`}</Text>
            <Text style={styles.textoFidelidadeResumo}>{`Faltam ${pedidosRestantes} pedido(s) para o próximo desconto de 10%`}</Text>
          </View>
        )}
      </FadeInView>

      <View style={styles.cabecalhoPedidos}>
        <Text style={styles.tituloSecao}>Pedidos</Text>
        <Text style={styles.subtituloSecao}>Filtre por status ou busque por número</Text>
      </View>

      <View style={styles.filtrosWrap}>
        {FILTROS.map((filtro) => {
          const ativo = filtroSelecionado === filtro.id;
          return (
            <TouchableOpacity
              key={filtro.id}
              style={[styles.filtroChip, ativo && styles.filtroChipAtivo]}
              onPress={() => setFiltroSelecionado(filtro.id)}
              activeOpacity={0.85}
            >
              <Text style={[styles.filtroChipTexto, ativo && styles.filtroChipTextoAtivo]}>{filtro.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.buscaWrap}>
        <TextInput
          style={styles.inputBusca}
          placeholder="Buscar pedido por número (ex: #1234)"
          placeholderTextColor={theme.colors.textMuted}
          value={buscaPedido}
          onChangeText={setBuscaPedido}
          autoCapitalize="none"
        />
      </View>

      {semHistorico ? (
        <FadeInView style={styles.estadoVazio} delay={70}>
          <Text style={styles.tituloVazio}>Nenhum pedido encontrado</Text>
          <Text style={styles.subtituloVazio}>Ajuste o filtro ou faça uma nova compra.</Text>
        </FadeInView>
      ) : (
        <FadeInView style={styles.listaPedidosWrap} delay={70}>
          <View style={styles.listaPedidos}>
            {secoesPedidos.map((secao) => (
              <View key={secao.chave}>
                <Text style={styles.tituloDataSecao}>{secao.titulo}</Text>

                {secao.pedidos.map((pedido) => {
                  const statusConcluido = pedido.status === 'Concluído';
                  const statusRetirada = pedido.status === 'Pronto para retirada';
                  const chavePedido = `${pedido.id}-${pedido.data}`;
                  const estaExpandido = pedidoExpandido === chavePedido;
                  const itensPedido = Array.isArray(pedido.itens) ? pedido.itens : [];

                  return (
                    <TouchableOpacity
                      key={chavePedido}
                      style={styles.cardPedido}
                      activeOpacity={0.92}
                      onPress={() => alternarExpansaoPedido(chavePedido)}
                    >
                      <View style={styles.linhaCabecalhoCard}>
                        <Text style={styles.idPedido}>{`Pedido ${pedido.id}`}</Text>
                        <View style={styles.cabecalhoAcoes}>
                          {Number(pedido.descontoAplicado || 0) > 0 ? (
                            <View style={styles.badgeDesconto}>
                              <Text style={styles.textoBadgeDesconto}>Desconto usado</Text>
                            </View>
                          ) : null}
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

                      <StepTimeline status={pedido.status} />
                      <Text style={styles.tempoRestante}>{calcularTempoRestante(pedido)}</Text>

                      <View style={styles.linhaInfo}>
                        <Text style={styles.label}>Data</Text>
                        <Text style={styles.valor}>{formatarData(pedido.data)}</Text>
                      </View>

                      <View style={styles.linhaInfo}>
                        <Text style={styles.label}>Itens</Text>
                        <Text style={styles.valor}>{pedido.totalItens}</Text>
                      </View>

                      {Number(pedido.descontoAplicado || 0) > 0 ? (
                        <View style={styles.linhaInfo}>
                          <Text style={styles.label}>Desconto</Text>
                          <Text style={styles.valor}>{`- ${formatarValor(pedido.descontoAplicado)}`}</Text>
                        </View>
                      ) : null}

                      {Number(pedido.descontoAplicado || 0) > 0 ? (
                        <View style={styles.linhaInfo}>
                          <Text style={styles.label}>Origem</Text>
                          <Text style={styles.valor}>
                            {pedido.descontoOrigem === 'fidelidade' ? 'Fidelidade' : 'Outro desconto'}
                          </Text>
                        </View>
                      ) : null}

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
              </View>
            ))}
          </View>
        </FadeInView>
      )}

      <FadeInView style={styles.rodapeAcoes} delay={120}>
        <PrimaryButton title="Sair da conta" variant="secondary" onPress={logout} />
      </FadeInView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 20,
  },
  infoAluno: {
    alignItems: 'flex-end',
  },
  textoAluno: {
    color: theme.colors.accentSoft,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },
  textoTurma: {
    marginTop: 2,
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  heroPerfil: {
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#3A2B33',
    backgroundColor: '#181117',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    overflow: 'hidden',
    ...theme.shadow,
  },
  avatarPerfil: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.accent,
    borderWidth: 2,
    borderColor: '#F3D8E0',
  },
  avatarTexto: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  heroInfoPerfil: {
    flex: 1,
  },
  heroTituloPerfil: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 28,
  },
  heroSubtituloPerfil: {
    marginTop: 4,
    marginBottom: 8,
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  blocoPerfil: {
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: 12,
    ...theme.shadow,
  },
  cabecalhoPerfil: {
    marginBottom: 10,
  },
  tituloSecao: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  subtituloCard: {
    marginTop: 2,
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  badgePerfil: {
    minHeight: 26,
    borderRadius: 13,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  badgeProfessor: {
    backgroundColor: '#2A1017',
    borderColor: theme.colors.accent,
  },
  badgeAluno: {
    backgroundColor: '#13233A',
    borderColor: '#4E89D6',
  },
  textoBadgePerfil: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  gridDadosPerfil: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cardDadoPerfil: {
    flexGrow: 1,
    flexBasis: '48%',
    minHeight: 74,
    borderRadius: 14,
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 10,
    justifyContent: 'space-between',
  },
  linhaPerfil: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    gap: 12,
  },
  labelPerfil: {
    color: theme.colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  valorPerfil: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'right',
  },
  tituloBeneficios: {
    marginTop: 10,
    marginBottom: 6,
    color: theme.colors.accentSoft,
    fontSize: 14,
    fontWeight: '700',
  },
  linhaBeneficio: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconeBeneficioWrap: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#234D34',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  iconeBeneficio: {
    color: '#D3F8E0',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 13,
  },
  itemBeneficio: {
    color: theme.colors.text,
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  fidelidadeBox: {
    marginTop: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#43323C',
    backgroundColor: '#1A1217',
    padding: 10,
  },
  linhaPerfilFidelidade: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  labelFidelidade: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  valorFidelidade: {
    color: theme.colors.accentSoft,
    fontSize: 13,
    fontWeight: '800',
  },
  textoFidelidadeResumo: {
    marginTop: 2,
    color: theme.colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 2,
  },
  cabecalhoPedidos: {
    marginTop: 12,
    marginHorizontal: 10,
    marginBottom: 2,
  },
  subtituloSecao: {
    marginTop: 2,
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  filtrosWrap: {
    marginTop: 8,
    marginHorizontal: 10,
    flexDirection: 'row',
    gap: 8,
  },
  filtroChip: {
    paddingHorizontal: 10,
    minHeight: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtroChipAtivo: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accentStrong,
  },
  filtroChipTexto: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  filtroChipTextoAtivo: {
    color: '#FFFFFF',
  },
  buscaWrap: {
    marginTop: 8,
    marginHorizontal: 10,
  },
  inputBusca: {
    minHeight: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#0E0D0F',
    color: theme.colors.text,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  estadoVazio: {
    marginTop: 8,
    marginHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 28,
    ...theme.shadow,
  },
  tituloVazio: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtituloVazio: {
    marginTop: 8,
    color: theme.colors.textMuted,
    fontSize: 16,
    textAlign: 'center',
  },
  listaPedidosWrap: {
    marginTop: 6,
  },
  listaPedidos: {
    paddingHorizontal: 10,
    gap: 10,
  },
  tituloDataSecao: {
    color: theme.colors.accentSoft,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 6,
  },
  cardPedido: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#28364A',
    backgroundColor: '#0D1620',
    padding: 12,
    marginBottom: 10,
    ...theme.shadow,
  },
  linhaCabecalhoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 8,
  },
  cabecalhoAcoes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgeDesconto: {
    minHeight: 24,
    borderRadius: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A1017',
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  textoBadgeDesconto: {
    color: theme.colors.accentSoft,
    fontSize: 11,
    fontWeight: '800',
  },
  idPedido: {
    color: theme.colors.text,
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
    backgroundColor: '#5A4D36',
  },
  badgeConcluido: {
    backgroundColor: '#35724E',
  },
  badgeRetirada: {
    backgroundColor: theme.colors.accent,
  },
  textoStatus: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  iconeExpandir: {
    color: theme.colors.accentSoft,
    fontSize: 18,
    fontWeight: '700',
    minWidth: 14,
    textAlign: 'center',
  },
  timelineWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#111A24',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  timelinePonto: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#58657A',
    marginRight: 4,
  },
  timelinePontoAtivo: {
    backgroundColor: theme.colors.accent,
  },
  timelineTexto: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  timelineTextoAtivo: {
    color: theme.colors.text,
  },
  timelineLinha: {
    flex: 1,
    height: 2,
    backgroundColor: '#425166',
    marginLeft: 6,
    marginRight: 6,
  },
  timelineLinhaAtiva: {
    backgroundColor: theme.colors.accent,
  },
  tempoRestante: {
    color: theme.colors.accentSoft,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  linhaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    color: theme.colors.textMuted,
    fontSize: 15,
    fontWeight: '500',
  },
  valor: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  secaoDetalhes: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#2B3441',
    paddingTop: 10,
    gap: 8,
  },
  tituloDetalhes: {
    color: theme.colors.accentSoft,
    fontSize: 15,
    fontWeight: '700',
  },
  itemDetalhe: {
    backgroundColor: '#11161D',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#243040',
  },
  nomeDetalheItem: {
    color: theme.colors.text,
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
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  valorDetalhe: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  rodapeAcoes: {
    paddingHorizontal: 10,
    paddingBottom: 14,
    paddingTop: 2,
  },
});
