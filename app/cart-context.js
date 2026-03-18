import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const CartContext = createContext(null);
const STATUS_EM_PREPARACAO = 'Em preparação';
const STATUS_PRONTO_RETIRADA = 'Pronto para retirada';
const STATUS_CONCLUIDO = 'Concluído';

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
  const [itens, setItens] = useState([]);
  const [historicoPedidos, setHistoricoPedidos] = useState([]);
  const timersRef = useRef([]);
  const timerAvisoRef = useRef(null);
  const [avisoPedidoPronto, setAvisoPedidoPronto] = useState(null);

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

  const registrarPedido = useCallback((pedidoId, itensPedido, tempoEstimadoMinutos) => {
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

    const minutosValidados = Math.max(1, Number(tempoEstimadoMinutos || 0));

    setHistoricoPedidos((pedidosAtuais) => [
      {
        id: pedidoId,
        data: new Date().toISOString(),
        totalItens: totalItensPedido,
        totalValor: totalValorPedido,
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
      timersRef.current.forEach((timerId) => clearTimeout(timerId));
      timersRef.current = [];

      if (timerAvisoRef.current) {
        clearTimeout(timerAvisoRef.current);
      }
    };
  }, []);

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
