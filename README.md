# FiaPass - Cantina FIAP

Aplicativo mobile desenvolvido com React Native + Expo para simular o fluxo de compra na cantina (Kitchenette), reduzindo filas e melhorando a experiência dos alunos no intervalo.

## Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Integrantes do Grupo](#integrantes-do-grupo)
- [Como Rodar o Projeto](#como-rodar-o-projeto)
- [Demonstração](#demonstracao)
- [Decisões Técnicas](#decisoes-tecnicas)
- [Próximos Passos](#proximos-passos)
- [Tecnologias](#tecnologias)
- [Status](#status)

<a id="sobre-o-projeto"></a>

## Sobre o Projeto

### Problema que o app resolve
Em horários de pico, a operação da cantina pode gerar filas longas, espera e dificuldade para acompanhar o status do pedido. O app centraliza o processo de compra em um fluxo simples: escolher itens, pagar e acompanhar preparo/retirada.

### Operação da FIAP escolhida e justificativa
Operação escolhida: **Cantina/Kitchenette da FIAP**.

Motivo:
- Alta frequência de uso por alunos.
- Dor real de fila/tempo de espera.
- Cenário ideal para aplicar navegação mobile, estados e feedback visual.

### Funcionalidades implementadas
- Listagem de produtos do cardápio.
- Filtro por categorias (Tudo, Salgado, Doce, Bebidas e Combos).
- Adição de itens ao carrinho.
- Ajuste de quantidade no carrinho (+ e -).
- Feedback visual ao adicionar/remover item (toasts e destaque visual).
- Fluxo de pagamento com seleção da forma de pagamento.
- Tela de processamento do pagamento com loading e barra de progresso.
- Geração de pedido com ID e tempo estimado.
- Histórico de pedidos no perfil.
- Expansão de pedido no perfil para ver itens, valor unitário, quantidade e subtotal.
- Atualização automática de status do pedido (Em preparação -> Pronto para retirada -> Concluído).
- Toast global (em qualquer tela) quando o pedido está pronto para retirada.

<a id="integrantes-do-grupo"></a>

## Integrantes do Grupo

Preencher com os dados oficiais do grupo:

1. Augusto Douglas Mendonça - RM: 558371
2. Gabriel Vasquez - RM: 557056
3. Gustavo Oliveira - RM: 559163

<a id="como-rodar-o-projeto"></a>

## Como Rodar o Projeto

### Pré-requisitos
- Node.js (LTS recomendado)
- npm (instalado com Node)
- Expo Go no celular (Android/iOS) **ou** emulador configurado
- Git

### Passo a passo
1. Clonar o repositório:

```bash
git clone https://github.com/gvqsilva/fiap-mdi-cp1-cantina-app
cd cantina-app
```

2. Instalar dependências:

```bash
npm install
```

3. Rodar o projeto:

```bash
npx expo start
```

4. Abrir no dispositivo:
- No celular: escanear o QR Code com Expo Go.
- No emulador Android: pressionar `a` no terminal do Expo.
- No iOS (macOS): pressionar `i`.

<a id="demonstracao"></a>

## Demonstração

### Prints das telas (mínimo: uma por tela)
Recomendação: criar a pasta `assets/screenshots` e salvar os prints com nomes padronizados.

Telas sugeridas para print:
- Home/Cardápio
- Carrinho
- Pagamento
- Processando pagamento
- Pedido
- Perfil/Histórico

Checklist de entrega:
- [ ] Print da Home
<img width="150" alt="image" src="https://github.com/user-attachments/assets/ae41b8b3-5d6c-491f-b6bb-ed5f3bc19f6c" />

- [ ] Print do Carrinho
<img width="150" alt="image" src="https://github.com/user-attachments/assets/a7a65f4a-0701-4317-8539-3e9857399058" />

- [ ] Print do Pagamento
<img width="150" alt="image" src="https://github.com/user-attachments/assets/9730d960-e1ba-419a-b7dd-89a7040ff9af" />

- [ ] Print de Processamento
<img width="150" alt="image" src="https://github.com/user-attachments/assets/d87a8851-cbb1-454b-8ae5-14bda90e5fcf" />

- [ ] Print da tela de Pedido
<img width="150" alt="image" src="https://github.com/user-attachments/assets/c0a92bf4-4637-476c-b334-5e9961d464dd" />

- [ ] Print do Perfil com histórico
<img width="150" alt="image" src="https://github.com/user-attachments/assets/e18479ee-5551-4476-8564-7a624f22efa9" />

<a id="decisoes-tecnicas"></a>

## Decisões Técnicas

### Estrutura do projeto
- Roteamento baseado em arquivos com Expo Router.
- Telas principais em `app/`.
- Estado global de carrinho e pedidos em `app/cart-context.js` usando Context API.

Arquivos principais:
- `app/_layout.js`: configuração de navegação por abas e toast global.
- `app/home.js`: cardápio, filtros e adição ao carrinho.
- `app/carrinho.js`: revisão do pedido e ajuste de quantidades.
- `app/pagamento.js`: seleção de forma de pagamento e resumo.
- `app/processando-pagamento.js`: loading/progresso e registro do pedido.
- `app/pedido.js`: resumo final do pedido.
- `app/perfil.js`: histórico e detalhamento expansível.

### Hooks utilizados e finalidade
- `useState`: estados de interface (filtros, seleção, expansão, mensagens).
- `useEffect`: side effects (timers, limpeza de recursos, reações a mudanças de estado).
- `useMemo`: otimizações para dados derivados (ex.: filtros e totais).
- `useCallback`: funções estáveis para handlers e ações de contexto.
- `useRef`: controle de animações, timers e snapshots de estado.

### Navegação
- Abas principais: Home, Carrinho e Perfil.
- Rotas auxiliares fora das abas visíveis: Pagamento, Processando Pagamento e Pedido.
- Fluxo principal: Home -> Carrinho -> Pagamento -> Processando -> Pedido -> Perfil.

<a id="proximos-passos"></a>

## Próximos Passos

Com mais tempo, o grupo pode evoluir para:

- Integração com backend real (produtos, autenticação e pedidos).
- Cadastro/login de usuário.
- Notificações push para status de pedido pronto.
- Busca de produtos e favoritos.

<a id="tecnologias"></a>

## Tecnologias

- React Native
- Expo
- Expo Router
- JavaScript (ES6+)

<a id="status"></a>

## Status

Projeto acadêmico em evolução para a disciplina de Mobile (FIAP).
