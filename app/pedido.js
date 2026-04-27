import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ThemedHeader from '../components/ThemedHeader';
import PrimaryButton from '../components/PrimaryButton';
import ScreenBackground from '../components/ScreenBackground';
import FadeInView from '../components/FadeInView';
import { theme } from './theme';

export default function Pedido() {
  const router = useRouter();
  const { id, tempo } = useLocalSearchParams();

  const idPedido = typeof id === 'string' && id.length > 0 ? id : '#0000';
  const tempoPedido = typeof tempo === 'string' && tempo.length > 0 ? tempo : '6';

  return (
    <View style={styles.container}>
      <ScreenBackground />
      <ThemedHeader title={`Pedido ${idPedido}`} subtitle="Acompanhe o preparo em tempo real" />

      <View style={styles.conteudo}>
        <FadeInView style={styles.blocoCentral}>
          <View style={styles.cardPedido}>
            <View style={styles.badgeStatus}>
              <Text style={styles.textoBadge}>Em preparo</Text>
            </View>

            <Text style={styles.textoInfo}>
              Seu pedido foi enviado para a <Text style={styles.textoKitchenette}>Kitchenette</Text>.
            </Text>
            <Text style={styles.textoInfo}>Tempo estimado para retirada:</Text>

            <View style={styles.boxTempo}>
              <Text style={styles.textoTempo}>{`${tempoPedido} MIN`}</Text>
            </View>

            <PrimaryButton title="Ver histórico" variant="secondary" onPress={() => router.push('/perfil')} />
          </View>

          <FadeInView delay={100}>
            <PrimaryButton title="Voltar para Home" onPress={() => router.replace('/home')} style={styles.botaoHome} />
          </FadeInView>
        </FadeInView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  conteudo: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
    paddingBottom: 20,
  },
  blocoCentral: {
    width: '100%',
  },
  cardPedido: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingTop: 16,
    paddingHorizontal: 14,
    paddingBottom: 16,
    alignItems: 'center',
    ...theme.shadow,
  },
  badgeStatus: {
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2A1017',
    borderWidth: 1,
    borderColor: theme.colors.accent,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  textoBadge: {
    color: theme.colors.accentSoft,
    fontSize: 14,
    fontWeight: '700',
  },
  textoInfo: {
    color: theme.colors.text,
    fontSize: 17,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 2,
  },
  textoKitchenette: {
    color: theme.colors.accentSoft,
    fontWeight: '700',
  },
  boxTempo: {
    marginTop: 14,
    width: '90%',
    minHeight: 116,
    borderRadius: 18,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: theme.colors.accentStrong,
    ...theme.glow,
  },
  labelTempo: {
    color: '#F7DCE5',
    fontSize: 14,
    fontWeight: '600',
  },
  textoTempo: {
    color: '#FFFFFF',
    fontSize: 50,
    fontWeight: '700',
    lineHeight: 52,
    letterSpacing: 0.3,
  },
  botaoHome: {
    marginTop: 14,
    minHeight: 52,
  },
});
