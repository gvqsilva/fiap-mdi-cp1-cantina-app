import { useMemo, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from './auth-context';
import { theme } from './theme';

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

function getErros({ email, senha }) {
  return {
    email: !email ? 'O e-mail é obrigatório' : !validarEmail(email) ? 'Digite um e-mail válido' : '',
    senha: !senha ? 'A senha é obrigatória' : senha.length < 6 ? 'A senha deve ter pelo menos 6 caracteres' : '',
  };
}

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tocouEmail, setTocouEmail] = useState(false);
  const [tocouSenha, setTocouSenha] = useState(false);
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [erroCredencial, setErroCredencial] = useState('');
  const [enviando, setEnviando] = useState(false);

  const erros = useMemo(() => getErros({ email, senha }), [email, senha]);
  const possuiErros = Boolean(erros.email || erros.senha);
  const podeEnviar = !possuiErros;

  const onSubmit = async () => {
    setTentouEnviar(true);
    setErroCredencial('');

    if (!podeEnviar || enviando) {
      return;
    }

    setEnviando(true);

    try {
      const resultado = await login({ email, senha });

      if (!resultado.sucesso) {
        setErroCredencial(resultado.erro || 'Não foi possível fazer login.');
        return;
      }

      router.replace('/home');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.logoWrap}>
          <Image source={require('../assets/fiap-logo.png')} style={styles.logo} resizeMode="contain" />
        </View>

        <Text style={styles.titulo}>Entrar</Text>
        <Text style={styles.subtitulo}>Acesse sua conta para continuar</Text>

        <View style={styles.grupoCampo}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="usuario@dominio.com"
            placeholderTextColor={theme.colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            onBlur={() => setTocouEmail(true)}
          />
          {(tentouEnviar || tocouEmail) && erros.email ? <Text style={styles.erro}>{erros.email}</Text> : null}
        </View>

        <View style={styles.grupoCampo}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="******"
            placeholderTextColor={theme.colors.textMuted}
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
            onBlur={() => setTocouSenha(true)}
          />
          {(tentouEnviar || tocouSenha) && erros.senha ? <Text style={styles.erro}>{erros.senha}</Text> : null}
        </View>

        {erroCredencial ? <Text style={styles.erro}>{erroCredencial}</Text> : null}

        <PrimaryButton title={enviando ? 'Entrando...' : 'Entrar'} disabled={enviando} onPress={onSubmit} />

        <TouchableOpacity onPress={() => router.push('/escolher-tipo')} activeOpacity={0.85} style={styles.linkWrap}>
          <Text style={styles.link}>Não tem conta? Criar cadastro</Text>
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
  logoWrap: {
    alignItems: 'center',
    marginBottom: 14,
  },
  logo: {
    width: 92,
    height: 92,
  },
  titulo: {
    color: theme.colors.text,
    fontSize: 32,
    fontWeight: '800',
  },
  subtitulo: {
    marginTop: 4,
    color: theme.colors.textMuted,
    fontSize: 14,
    marginBottom: 14,
  },
  grupoCampo: {
    marginBottom: 10,
  },
  label: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#0E0D0F',
    color: theme.colors.text,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  erro: {
    marginTop: 5,
    color: '#FF5E5E',
    fontSize: 12,
    fontWeight: '600',
  },
  linkWrap: {
    marginTop: 12,
    alignItems: 'center',
  },
  link: {
    color: theme.colors.accentSoft,
    fontSize: 14,
    fontWeight: '600',
  },
});
