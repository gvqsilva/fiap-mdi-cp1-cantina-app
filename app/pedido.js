import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function Pedido() {
  const router = useRouter();
  const { id, tempo } = useLocalSearchParams();

  const idPedido = typeof id === 'string' && id.length > 0 ? id : '#0000';
  const tempoPedido = typeof tempo === 'string' && tempo.length > 0 ? tempo : '6';

  return (
    <View style={styles.container}>
      <View style={styles.topo}>
        <Text style={styles.tituloTopo}>{`Pedido ${idPedido}`}</Text>
      </View>

      <View style={styles.conteudo}>
        <View style={styles.blocoCentral}>
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

            <TouchableOpacity
              style={styles.botaoDetalhes}
              activeOpacity={0.85}
              onPress={() => router.push('/perfil')}
            >
              <Text style={styles.textoBotaoDetalhes}>Ver histórico</Text>
              <View style={[styles.setaWrap, styles.setaAbsoluta]}>
                <Text style={styles.textoSeta}>›</Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.botaoHome} activeOpacity={0.85} onPress={() => router.replace('/home')}>
            <Text style={styles.textoBotaoHome}>Voltar para Home</Text>
            <View style={[styles.setaWrap, styles.setaAbsoluta]}>
              <Text style={styles.textoSeta}>›</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9D9D9D',
  },
  topo: {
    backgroundColor: '#AD395A',
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    minHeight: 102,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tituloTopo: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 32,
    textAlign: 'center',
  },
  conteudo: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'center',
    paddingBottom: 20,
  },
  blocoCentral: {
    width: '100%',
  },
  cardPedido: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#9A9A9A',
    backgroundColor: '#E0E0E0',
    paddingTop: 16,
    paddingHorizontal: 14,
    paddingBottom: 16,
    alignItems: 'center',
  },
  badgeStatus: {
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E9D3DB',
    borderWidth: 1,
    borderColor: '#C48BA0',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  textoBadge: {
    color: '#7A2B47',
    fontSize: 14,
    fontWeight: '700',
  },
  textoInfo: {
    color: '#303030',
    fontSize: 17,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 2,
  },
  textoKitchenette: {
    color: '#3F8D45',
    fontWeight: '700',
  },
  boxTempo: {
    marginTop: 14,
    width: '90%',
    minHeight: 116,
    borderRadius: 18,
    backgroundColor: '#B03A5A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#9A2E4B',
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
  botaoDetalhes: {
    marginTop: 16,
    minHeight: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    backgroundColor: '#EAEAEA',
    paddingHorizontal: 14,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },
  textoBotaoDetalhes: {
    color: '#2B2B2B',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  botaoHome: {
    marginTop: 14,
    minHeight: 60,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#A0A0A0',
    backgroundColor: '#E8E8E8',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  textoBotaoHome: {
    color: '#252525',
    fontSize: 23,
    fontWeight: '600',
    textAlign: 'center',
  },
  setaWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D8CBD0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  setaAbsoluta: {
    position: 'absolute',
    right: 10,
  },
  textoSeta: {
    color: '#7C2E4A',
    fontSize: 20,
    lineHeight: 20,
    fontWeight: '700',
    marginTop: -1,
  },
});
