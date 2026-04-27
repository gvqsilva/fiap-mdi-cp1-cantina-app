import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenBackground from '../components/ScreenBackground';
import PrimaryButton from '../components/PrimaryButton';
import { theme } from './theme';

export default function EscolherTipo() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScreenBackground />

      <View style={styles.card}>
        <Text style={styles.titulo}>Sou aluno ou professor?</Text>
        <Text style={styles.subtitulo}>Escolha seu perfil para continuar o cadastro</Text>

        <View style={styles.botaoWrap}>
          <PrimaryButton title="Sou aluno" onPress={() => router.push({ pathname: '/cadastro', params: { papel: 'aluno' } })} />
        </View>

        <View style={styles.botaoWrap}>
          <PrimaryButton title="Sou professor" variant="secondary" onPress={() => router.push({ pathname: '/cadastro', params: { papel: 'professor' } })} />
        </View>

        <TouchableOpacity onPress={() => router.replace('/login')} style={styles.voltarWrap} activeOpacity={0.85}>
          <Text style={styles.link}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  card: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: 16,
    ...theme.shadow,
  },
  titulo: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  subtitulo: {
    marginTop: 6,
    color: theme.colors.textMuted,
    fontSize: 14,
    marginBottom: 18,
  },
  botaoWrap: {
    marginBottom: 12,
  },
  voltarWrap: {
    marginTop: 8,
    alignItems: 'center',
  },
  link: {
    color: theme.colors.accentSoft,
    fontSize: 14,
    fontWeight: '600',
  },
});
