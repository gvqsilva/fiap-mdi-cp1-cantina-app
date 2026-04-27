import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from './cart-context';
import { useAuth } from './auth-context';
import ThemedHeader from '../components/ThemedHeader';
import PrimaryButton from '../components/PrimaryButton';
import ScreenBackground from '../components/ScreenBackground';
import FadeInView from '../components/FadeInView';
import ScalePressable from '../components/ScalePressable';
import { theme } from './theme';
import { PRODUTOS_DESTAQUE } from './menu-data';

export default function Home() {
  const router = useRouter();
  const { totalItens } = useCart();
  const { usuarioLogado } = useAuth();
  const destaques = PRODUTOS_DESTAQUE;
  const primeiroNome = String(usuarioLogado?.nome || 'Usuário').split(' ')[0];

  return (
    <View style={styles.container}>
      <ScreenBackground />
      <ThemedHeader
        title="Home"
        subtitle={`Seu pedido começa por aqui.`}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.conteudo}>
        <FadeInView style={styles.heroCard}>
          <View style={styles.heroLogoWrap}>
            <Image source={require('../assets/fiap-logo.png')} style={styles.heroLogo} resizeMode="contain" />
          </View>

          <View style={styles.heroGlow} />
          <Text style={styles.heroTag}>Pedido rápido</Text>
          <Text style={styles.heroTitulo}>Escolha, pague e acompanhe sem sair da tela</Text>
          <Text style={styles.heroTexto}>
            Monte seu pedido em poucos toques e acompanhe o preparo com um fluxo mais simples e direto.
          </Text>

          <View style={styles.heroStats}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>No carrinho</Text>
              <Text style={styles.statValue}>{totalItens}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Atalho</Text>
              <Text style={styles.statValue}>Cardápio</Text>
            </View>
          </View>

          <PrimaryButton
            title="Ir para o cardápio"
            onPress={() =>
              router.push({
                pathname: '/cardapio',
                params: { entrada: 'cinema' },
              })
            }
            style={styles.heroBotao}
          />
        </FadeInView>

        <FadeInView style={styles.linhaAcoes} delay={70}>
          <ScalePressable style={styles.atalhoCard} onPress={() => router.push('/carrinho')}>
            <Text style={styles.atalhoLabel}>Acesso rápido</Text>
            <Text style={styles.atalhoTitulo}>Carrinho</Text>
            <Text style={styles.atalhoTexto}>Você tem {totalItens} item(ns)</Text>
          </ScalePressable>

          <ScalePressable style={styles.atalhoCard} onPress={() => router.push('/perfil')}>
            <Text style={styles.atalhoLabel}>Acesso rápido</Text>
            <Text style={styles.atalhoTitulo}>Perfil</Text>
            <Text style={styles.atalhoTexto}>Veja seu histórico e fidelidade</Text>
          </ScalePressable>
        </FadeInView>

        <FadeInView style={styles.secao} delay={120}>
          <View style={styles.secaoCabecalho}>
            <View>
              <Text style={styles.secaoTitulo}>Destaques do dia</Text>
              <Text style={styles.secaoSubtitulo}>Sugestões para começar mais rápido</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() =>
                router.push({
                  pathname: '/cardapio',
                  params: { filtro: 'destaques', entrada: 'cinema' },
                })
              }
            >
              <Text style={styles.verTudo}>Ver tudo</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.listaDestaques}>
            {destaques.map((item) => (
              <ScalePressable
                key={item.id}
                style={styles.cardDestaque}
                onPress={() =>
                  router.push({
                    pathname: '/cardapio',
                    params: { filtro: 'destaques', entrada: 'cinema' },
                  })
                }
              >
                <Image source={item.imagem} style={styles.imagemDestaque} resizeMode="cover" />
                <Text style={styles.nomeDestaque} numberOfLines={2}>
                  {item.nome}
                </Text>
                <Text style={styles.valorDestaque}>{item.valor}</Text>
              </ScalePressable>
            ))}
          </ScrollView>
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
  conteudo: {
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 26,
    gap: 14,
  },
  headerBadge: {
    minHeight: 28,
    paddingHorizontal: 10,
    borderRadius: theme.radius.pill,
    backgroundColor: '#20161B',
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: 'center',
  },
  headerBadgeTexto: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
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
  heroCard: {
    borderRadius: 22,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 14,
    overflow: 'hidden',
    ...theme.shadow,
  },
  heroGlow: {
    position: 'absolute',
    right: -20,
    top: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(173, 57, 90, 0.18)',
  },
  heroLogoWrap: {
    alignItems: 'center',
    marginBottom: 12,
  },
  heroLogo: {
    width: 96,
    height: 96,
  },
  heroTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.pill,
    backgroundColor: '#2A1017',
    color: theme.colors.accentSoft,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  heroTitulo: {
    color: theme.colors.text,
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '800',
  },
  heroTexto: {
    marginTop: 6,
    color: theme.colors.textMuted,
    fontSize: 15,
    lineHeight: 20,
  },
  heroStats: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  statCard: {
    flex: 1,
    minHeight: 74,
    borderRadius: 16,
    padding: 12,
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statLabel: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  statValue: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  heroBotao: {
    marginTop: 12,
  },
  linhaAcoes: {
    flexDirection: 'row',
    gap: 8,
  },
  atalhoCard: {
    flex: 1,
    minHeight: 106,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceAlt,
    padding: 12,
    justifyContent: 'space-between',
    ...theme.shadow,
  },
  atalhoLabel: {
    color: theme.colors.accentSoft,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  atalhoTitulo: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  atalhoTexto: {
    color: theme.colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  secao: {
    marginTop: 4,
  },
  secaoCabecalho: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 12,
  },
  secaoTitulo: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 2,
  },
  secaoSubtitulo: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  verTudo: {
    color: theme.colors.accentSoft,
    fontSize: 13,
    fontWeight: '700',
  },
  listaDestaques: {
    paddingRight: 8,
  },
  cardDestaque: {
    width: 170,
    marginRight: 10,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#332B31',
    backgroundColor: theme.colors.surface,
    ...theme.shadow,
  },
  imagemDestaque: {
    width: '100%',
    height: 112,
  },
  nomeDestaque: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
    paddingHorizontal: 10,
    paddingTop: 9,
    minHeight: 56,
  },
  valorDestaque: {
    color: theme.colors.accentSoft,
    fontSize: 15,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
});
