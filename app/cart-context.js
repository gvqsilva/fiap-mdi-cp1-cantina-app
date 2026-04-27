import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './auth-context';

const CartContext = createContext(null);
const STATUS_EM_PREPARACAO = 'Em preparação';
const STATUS_PRONTO_RETIRADA = 'Pronto para retirada';
const STATUS_CONCLUIDO = 'Concluído';
const STORAGE_ITENS_KEY_PREFIX = '@cantina:itens';
const STORAGE_HISTORICO_KEY_PREFIX = '@cantina:historico';

function montarChavePorUsuario(prefixo, email) {
  const emailNormalizado = String(email || '').trim().toLowerCase();
  return `${prefixo}:${emailNormalizado || 'anonimo'}`;
}

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

export function CartProvider({ children }) {
  const { usuarioLogado } = useAuth();
  const [itens, setItens] = useState([]);
  const [historicoPedidos, setHistoricoPedidos] = useState([]);
  const [dadosHidratados, setDadosHidratados] = useState(false);
  const timersRef = useRef([]);
  const timerAvisoRef = useRef(null);
  const [avisoPedidoPronto, setAvisoPedidoPronto] = useState(null);

  const storageItensKey = useMemo(
    () => montarChavePorUsuario(STORAGE_ITENS_KEY_PREFIX, usuarioLogado?.email),
    [usuarioLogado?.email]
  );
  const storageHistoricoKey = useMemo(
    () => montarChavePorUsuario(STORAGE_HISTORICO_KEY_PREFIX, usuarioLogado?.email),
    [usuarioLogado?.email]
  );

  const limparTimers = useCallback(() => {
    timersRef.current.forEach((timerId) => clearTimeout(timerId));
    timersRef.current = [];

    if (timerAvisoRef.current) {
      clearTimeout(timerAvisoRef.current);
      timerAvisoRef.current = null;
    }
  }, []);

  useEffect(() => {
    let ativo = true;

    setDadosHidratados(false);
    setItens([]);
    setHistoricoPedidos([]);
    setAvisoPedidoPronto(null);
    limparTimers();

    const hidratarDados = async () => {
      try {
        const [itensSalvosRaw, historicoSalvoRaw] = await Promise.all([
          AsyncStorage.getItem(storageItensKey),
          AsyncStorage.getItem(storageHistoricoKey),
        ]);

        if (!ativo) {
          return;
        }

        if (itensSalvosRaw) {
          const itensSalvos = JSON.parse(itensSalvosRaw);
          if (Array.isArray(itensSalvos)) {
            setItens(itensSalvos);
          }
        }

        if (historicoSalvoRaw) {
          const historicoSalvo = JSON.parse(historicoSalvoRaw);
          if (Array.isArray(historicoSalvo)) {
            const agora = new Date();
            const historicoProcessado = historicoSalvo.map((pedido) => {
              if (pedido.status === STATUS_CONCLUIDO) {
                return pedido;
              }

              let novoStatus = pedido.status;

              if (pedido.previsaoConcluido && new Date(pedido.previsaoConcluido) <= agora) {
                novoStatus = STATUS_CONCLUIDO;
              } else if (pedido.previsaoPronto && new Date(pedido.previsaoPronto) <= agora) {
                novoStatus = STATUS_PRONTO_RETIRADA;
              }

              return { ...pedido, status: novoStatus };
            });
            setHistoricoPedidos(historicoProcessado);
          }
        }
      } catch {
        setItens([]);
        setHistoricoPedidos([]);
      } finally {
        if (ativo) {
          setDadosHidratados(true);
        }
      }
    };

    hidratarDados();

    return () => {
      ativo = false;
    };
  }, [limparTimers, storageHistoricoKey, storageItensKey]);

  useEffect(() => {
    if (!dadosHidratados) {
      return;
    }

    AsyncStorage.setItem(storageItensKey, JSON.stringify(itens));
  }, [dadosHidratados, itens, storageItensKey]);

  useEffect(() => {
    if (!dadosHidratados) {
      return;
    }

    AsyncStorage.setItem(storageHistoricoKey, JSON.stringify(historicoPedidos));
  }, [dadosHidratados, historicoPedidos, storageHistoricoKey]);

  const adicionarItem = useCallback((produto) => {
    setItens((itensAtuais) => {
      const indiceExistente = itensAtuais.findIndex((item) => item.id === produto.id);

      if (indiceExistente >= 0) {
        return itensAtuais.map((item, index) => {
          if (index !== indiceExistente) {
            return item;
          }

          return { ...item, quantidade: item.quantidade + 1 };
        });
      }

      return [...itensAtuais, { ...produto, quantidade: 1 }];
    });
  }, []);

  const limparCarrinho = useCallback(() => {
    setItens([]);
  }, []);

  const aumentarQuantidade = useCallback((produtoId) => {
    setItens((itensAtuais) =>
      itensAtuais.map((item) => {
        if (item.id !== produtoId) {
          return item;
        }

        return { ...item, quantidade: item.quantidade + 1 };
      })
    );
  }, []);

  const diminuirQuantidade = useCallback((produtoId) => {
    setItens((itensAtuais) =>
      itensAtuais.reduce((acumulado, item) => {
        if (item.id !== produtoId) {
          acumulado.push(item);
          return acumulado;
        }

        const novaQuantidade = item.quantidade - 1;

        if (novaQuantidade > 0) {
          acumulado.push({ ...item, quantidade: novaQuantidade });
        }

        return acumulado;
      }, [])
    );
  }, []);

  const registrarPedido = useCallback((pedidoId, itensPedido, tempoEstimadoMinutos, opcoes = {}) => {
    if (!Array.isArray(itensPedido) || itensPedido.length === 0) {
      return;
    }

    const itensDetalhados = itensPedido.map((item) => ({
      id: item.id,
      nome: item.nome,
      valor: item.valor,
      quantidade: item.quantidade,
      subtotal: valorParaNumero(item.valor) * item.quantidade,
    }));

    const totalItensPedido = itensPedido.reduce((acumulado, item) => acumulado + item.quantidade, 0);
    const totalValorPedido = itensPedido.reduce(
      (acumulado, item) => acumulado + valorParaNumero(item.valor) * item.quantidade,
      0
    );
    const descontoAplicado = Math.max(0, Number(opcoes?.descontoAplicado || 0));
    const totalFinalCalculado = Math.max(0, totalValorPedido - descontoAplicado);
    const totalFinalValido = Number(opcoes?.totalPedidoFinal);

    const minutosValidados = Math.max(1, Number(tempoEstimadoMinutos || 0));
    const dataPedido = new Date();

    setHistoricoPedidos((pedidosAtuais) => [
      {
        id: pedidoId,
        data: dataPedido.toISOString(),
        previsaoPronto: new Date(dataPedido.getTime() + minutosValidados * 60 * 1000).toISOString(),
        previsaoConcluido: new Date(dataPedido.getTime() + (minutosValidados * 60 * 1000 + 30 * 1000)).toISOString(),
        totalItens: totalItensPedido,
        totalValor: Number.isFinite(totalFinalValido) && totalFinalValido > 0 ? totalFinalValido : totalFinalCalculado,
        subtotalOriginal: totalValorPedido,
        descontoAplicado,
        descontoOrigem: descontoAplicado > 0 ? String(opcoes?.descontoOrigem || 'fidelidade') : '',
        cupom: typeof opcoes?.cupom === 'string' ? opcoes.cupom : '',
        status: STATUS_EM_PREPARACAO,
        itens: itensDetalhados,
      },
      ...pedidosAtuais,
    ]);

    const timeoutPronto = setTimeout(() => {
      setHistoricoPedidos((pedidosAtuais) =>
        pedidosAtuais.map((pedido) => {
          if (pedido.id !== pedidoId) {
            return pedido;
          }

          return { ...pedido, status: STATUS_PRONTO_RETIRADA };
        })
      );

      setAvisoPedidoPronto({
        id: pedidoId,
        mensagem: `Pedido ${pedidoId} pronto para retirada`,
      });

      if (timerAvisoRef.current) {
        clearTimeout(timerAvisoRef.current);
      }

      timerAvisoRef.current = setTimeout(() => {
        setAvisoPedidoPronto(null);
      }, 3500);
    }, minutosValidados * 60 * 1000);

    const timeoutConcluido = setTimeout(() => {
      setHistoricoPedidos((pedidosAtuais) =>
        pedidosAtuais.map((pedido) => {
          if (pedido.id !== pedidoId) {
            return pedido;
          }

          return { ...pedido, status: STATUS_CONCLUIDO };
        })
      );
    }, minutosValidados * 60 * 1000 + 30 * 1000);

    timersRef.current.push(timeoutPronto, timeoutConcluido);
  }, []);

  useEffect(() => {
    return () => {
      limparTimers();
    };
  }, [limparTimers]);

  const totalItens = useMemo(
    () => itens.reduce((acumulado, item) => acumulado + item.quantidade, 0),
    [itens]
  );

  const valor = useMemo(
    () => ({
      itens,
      historicoPedidos,
      avisoPedidoPronto,
      totalItens,
      adicionarItem,
      limparCarrinho,
      aumentarQuantidade,
      diminuirQuantidade,
      registrarPedido,
    }),
    [
      itens,
      historicoPedidos,
      avisoPedidoPronto,
      totalItens,
      adicionarItem,
      limparCarrinho,
      aumentarQuantidade,
      diminuirQuantidade,
      registrarPedido,
    ]
  );

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>;
}

export function useCart() {
  const contexto = useContext(CartContext);

  if (!contexto) {
    throw new Error('useCart deve ser usado dentro de CartProvider');
  }

  return contexto;
}
