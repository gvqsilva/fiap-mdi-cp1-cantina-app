import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [itens, setItens] = useState([]);

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

  const totalItens = useMemo(
    () => itens.reduce((acumulado, item) => acumulado + item.quantidade, 0),
    [itens]
  );

  const valor = useMemo(
    () => ({
      itens,
      totalItens,
      adicionarItem,
      limparCarrinho,
      aumentarQuantidade,
      diminuirQuantidade,
    }),
    [
      itens,
      totalItens,
      adicionarItem,
      limparCarrinho,
      aumentarQuantidade,
      diminuirQuantidade,
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
