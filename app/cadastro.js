import { useMemo, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from './auth-context';
import { theme } from './theme';

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

function getErros({ nome, email, senha, confirmarSenha, papel, rm, turma, professorId }) {
  return {
    nome: !nome ? 'O nome completo é obrigatório' : '',
    email: !email ? 'O e-mail é obrigatório' : !validarEmail(email) ? 'Digite um e-mail válido' : '',
    senha: !senha ? 'A senha é obrigatória' : senha.length < 6 ? 'A senha deve ter pelo menos 6 caracteres' : '',
    confirmarSenha: !confirmarSenha
      ? 'Confirme a senha'
      : confirmarSenha !== senha
      ? 'As senhas devem ser idênticas'
      : '',
    rm: papel === 'aluno' ? (!rm ? 'O RM é obrigatório' : '') : '',
    turma: papel === 'aluno' ? (!turma ? 'A turma é obrigatória' : '') : '',
    professorId:
      papel === 'professor'
        ? !professorId
          ? 'O número do professor é obrigatório'
          : !/^pf\d+$/i.test(professorId)
          ? 'Formato inválido (ex: pf1234)'
          : ''
        : '',
  };
}

export default function Cadastro() {
  const router = useRouter();
  const { cadastrar } = useAuth();
  const route = useRoute();
  const papel = route?.params?.papel || 'aluno';
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [rm, setRm] = useState('');
  const [turma, setTurma] = useState('');
  const [professorId, setProfessorId] = useState('');
  const [tocouNome, setTocouNome] = useState(false);
  const [tocouEmail, setTocouEmail] = useState(false);
  const [tocouSenha, setTocouSenha] = useState(false);
  const [tocouConfirmarSenha, setTocouConfirmarSenha] = useState(false);
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const erros = useMemo(
    () => getErros({ nome, email, senha, confirmarSenha, papel, rm, turma, professorId }),
    [nome, email, senha, confirmarSenha, papel, rm, turma, professorId]
  );
  const possuiErros = Boolean(
    erros.nome || erros.email || erros.senha || erros.confirmarSenha || erros.rm || erros.turma || erros.professorId
  );
  const podeEnviar = !possuiErros;

  const onSubmit = async () => {
    setTentouEnviar(true);

    if (!podeEnviar || enviando) {
      return;
    }

    setEnviando(true);

    try {
      const payload = { nome, email, senha, papel };

      if (papel === 'aluno') {
        payload.rm = rm;
        payload.turma = turma;
      }

      if (papel === 'professor') {
        payload.professorId = professorId;
      }

      await cadastrar(payload);
      router.replace('/login');
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

        <Text style={styles.titulo}>Cadastro</Text>
        <Text style={styles.subtitulo}>Crie sua conta para usar o app</Text>

        <View style={styles.grupoCampo}>
          <Text style={styles.label}>Nome completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu nome"
            placeholderTextColor={theme.colors.textMuted}
            value={nome}
            onChangeText={setNome}
            onBlur={() => setTocouNome(true)}
          />
          {(tentouEnviar || tocouNome) && erros.nome ? <Text style={styles.erro}>{erros.nome}</Text> : null}
        </View>

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

        <View style={styles.grupoCampo}>
          <Text style={styles.label}>Confirmação de senha</Text>
          <TextInput
            style={styles.input}
            placeholder="******"
            placeholderTextColor={theme.colors.textMuted}
            secureTextEntry
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            onBlur={() => setTocouConfirmarSenha(true)}
          />
          {(tentouEnviar || tocouConfirmarSenha) && erros.confirmarSenha ? (
            <Text style={styles.erro}>{erros.confirmarSenha}</Text>
          ) : null}
        </View>

        {papel === 'aluno' ? (
          <>
            <View style={styles.grupoCampo}>
              <Text style={styles.label}>RM</Text>
              <TextInput
                style={styles.input}
                placeholder="RM"
                placeholderTextColor={theme.colors.textMuted}
                value={rm}
                onChangeText={setRm}
              />
              {(tentouEnviar || false) && erros.rm ? <Text style={styles.erro}>{erros.rm}</Text> : null}
            </View>

            <View style={styles.grupoCampo}>
              <Text style={styles.label}>Turma</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 1A"
                placeholderTextColor={theme.colors.textMuted}
                value={turma}
                onChangeText={setTurma}
              />
              {(tentouEnviar || false) && erros.turma ? <Text style={styles.erro}>{erros.turma}</Text> : null}
            </View>
          </>
        ) : null}

        {papel === 'professor' ? (
          <View style={styles.grupoCampo}>
            <Text style={styles.label}>Número do professor</Text>
            <TextInput
              style={styles.input}
              placeholder="pf1234"
              placeholderTextColor={theme.colors.textMuted}
              value={professorId}
              onChangeText={setProfessorId}
              autoCapitalize="none"
            />
            {(tentouEnviar || false) && erros.professorId ? <Text style={styles.erro}>{erros.professorId}</Text> : null}
          </View>
        ) : null}

        <PrimaryButton title={enviando ? 'Cadastrando...' : 'Cadastrar'} disabled={enviando} onPress={onSubmit} />

        <TouchableOpacity onPress={() => router.replace('/login')} activeOpacity={0.85} style={styles.linkWrap}>
          <Text style={styles.link}>Já tem conta? Entrar</Text>
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
