import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);
const STORAGE_USER_KEY = '@cantina:user';
const STORAGE_SESSION_KEY = '@cantina:session';

function sanitizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

export function AuthProvider({ children }) {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [carregandoSessao, setCarregandoSessao] = useState(true);

  useEffect(() => {
    let ativo = true;

    const hidratarSessao = async () => {
      try {
        const [usuarioSalvoRaw, sessaoAtiva] = await Promise.all([
          AsyncStorage.getItem(STORAGE_USER_KEY),
          AsyncStorage.getItem(STORAGE_SESSION_KEY),
        ]);

        if (!ativo) {
          return;
        }

        if (!usuarioSalvoRaw || sessaoAtiva !== 'true') {
          setUsuarioLogado(null);
          return;
        }

        const usuarioSalvo = JSON.parse(usuarioSalvoRaw);

        if (usuarioSalvo?.email) {
          setUsuarioLogado({
            nome: usuarioSalvo.nome,
            email: usuarioSalvo.email,
            papel: usuarioSalvo.papel,
            rm: usuarioSalvo.rm,
            turma: usuarioSalvo.turma,
            professorId: usuarioSalvo.professorId,
          });
        }
      } catch {
        setUsuarioLogado(null);
      } finally {
        if (ativo) {
          setCarregandoSessao(false);
        }
      }
    };

    hidratarSessao();

    return () => {
      ativo = false;
    };
  }, []);

  const cadastrar = useCallback(async ({ nome, email, senha, papel, rm, turma, professorId }) => {
    const payload = {
      nome: String(nome || '').trim(),
      email: sanitizeEmail(email),
      senha: String(senha || ''),
      papel: String(papel || '').trim(),
    };

    if (payload.papel === 'aluno') {
      payload.rm = String(rm || '').trim();
      payload.turma = String(turma || '').trim();
    }

    if (payload.papel === 'professor') {
      payload.professorId = String(professorId || '').trim();
    }

    await AsyncStorage.setItem(STORAGE_USER_KEY, JSON.stringify(payload));
    await AsyncStorage.setItem(STORAGE_SESSION_KEY, 'false');

    return { sucesso: true };
  }, []);

  const login = useCallback(async ({ email, senha }) => {
    const usuarioSalvoRaw = await AsyncStorage.getItem(STORAGE_USER_KEY);

    if (!usuarioSalvoRaw) {
      return { sucesso: false, erro: 'Nenhum cadastro encontrado para este app.' };
    }

    const usuarioSalvo = JSON.parse(usuarioSalvoRaw);
    const emailDigitado = sanitizeEmail(email);

    if (usuarioSalvo.email !== emailDigitado || usuarioSalvo.senha !== String(senha || '')) {
      return { sucesso: false, erro: 'Credenciais inválidas. Verifique e-mail e senha.' };
    }

    await AsyncStorage.setItem(STORAGE_SESSION_KEY, 'true');
    setUsuarioLogado({
      nome: usuarioSalvo.nome,
      email: usuarioSalvo.email,
      papel: usuarioSalvo.papel,
      rm: usuarioSalvo.rm,
      turma: usuarioSalvo.turma,
      professorId: usuarioSalvo.professorId,
    });

    return { sucesso: true };
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.setItem(STORAGE_SESSION_KEY, 'false');
    setUsuarioLogado(null);
  }, []);

  const valor = useMemo(
    () => ({
      usuarioLogado,
      carregandoSessao,
      cadastrar,
      login,
      logout,
    }),
    [usuarioLogado, carregandoSessao, cadastrar, login, logout]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }

  return contexto;
}
