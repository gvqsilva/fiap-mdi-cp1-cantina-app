# FiaPass - Cantina FIAP

Aplicativo mobile desenvolvido com React Native + Expo para simular o fluxo de compra na cantina (Kitchenette), reduzindo filas e melhorando a experiência dos alunos no intervalo.

## Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Integrantes do Grupo](#integrantes-do-grupo)
- [Como Rodar o Projeto](#como-rodar-o-projeto)
- [Demonstração](#demonstracao)
- [Decisões Técnicas](#decisoes-tecnicas)
- [Diferenciais Implementados](#diferenciais)
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

#### Core
- Listagem de produtos do cardápio com imagens.
- Filtro por categorias (Tudo, Destaques, Salgado, Doce, Bebidas e Combos).
- Adição de itens ao carrinho com feedback visual.
- Ajuste de quantidade no carrinho (+ e -).
- Carrinho persistente (salvo em AsyncStorage).
- Fluxo de pagamento com seleção da forma de pagamento.
- Tela de processamento do pagamento com loading e barra de progresso.
- Geração de pedido com ID único e tempo estimado.
- Toast global (em qualquer tela) quando o pedido está pronto para retirada.

#### Autenticação e Perfil de Usuário
- Tela de seleção de papel (Aluno/Professor) antes do cadastro.
- Cadastro dinâmico com campos específicos por papel:
  - **Aluno**: RM e turma
  - **Professor**: Código do professor (pf####)
- Login com validação de e-mail e senha.
- Dados do usuário persistentes em AsyncStorage.
- Perfil com informações específicas por papel:
  - **Aluno**: E-mail, RM, turma e fidelidade
  - **Professor**: E-mail, código do professor e benefícios

#### Sistema de Fidelidade (Loyalty)
- Fidelidade adaptativa conforme o papel:
  - **Aluno**: 1 cupom de 10% a cada 10 pedidos concluídos
  - **Professor**: 1 cupom de 10% a cada 5 pedidos concluídos
- Desconto aplicado automaticamente ao atingir o limiar.
- Visualização de progresso da fidelidade no checkout.
- Rastreamento de desconto usado no histórico de pedidos (badge "Desconto usado").

#### Benefícios por Papel
- **Professor**: Redução de 30% no tempo de preparo do pedido.
- Cálculo automático do tempo estimado com base no papel.
- Exibição clara dos benefícios no perfil.

#### Histórico de Pedidos
- Histórico completo persistente por usuário (isolado por e-mail).
- Visualização de pedidos com data, hora, status e valor.
- Expansão de pedido para ver detalhes dos itens (valor unitário, quantidade, subtotal).
- Filtros por status: Todos, Em andamento, Concluídos.
- Busca por número de pedido.
- Agrupamento de pedidos por data (Hoje, Ontem, Data específica).
- Timeline visual mostrando status (Em preparação → Pronto para retirada → Concluído).
- Tempo restante estimado para conclusão do pedido.
- Indicação visual de desconto aplicado no pedido.

#### Status de Pedidos
- Atualização automática de status baseada em tempo:
  - Primeiro: "Em preparação" 
  - Segundo: "Pronto para retirada"
  - Terceiro: "Concluído"
- Persistência de status mesmo após fechar o app.
- Recálculo automático de status ao reabrir a aplicação.
- Timestamps salvos para rastreamento preciso.

#### Isolamento e Segurança de Dados
- Dados do usuário scoped por e-mail em AsyncStorage.
- Impossibilidade de acessar pedidos de outro usuário.
- Limpeza de dados ao fazer logout.

#### Design e UX
- Interface moderna com animações suaves (FadeInView, ScalePressable).
- Card hero em telas principais (Home, Cardápio, Perfil).
- Toast notifications para feedback do usuário.
- Scroll completo em telas longas (Home, Perfil, Cardápio).
- Feedback visual ao adicionar itens (mudança de cor, ícone checkmark).
- Tema dark com cores consistentes e acessibilidade.
- Responsividade para diferentes tamanhos de tela.

<a id="integrantes-do-grupo"></a>

## Integrantes do Grupo

Preencher com os dados oficiais do grupo:

1. Augusto Douglas Mendonça - RM: 558371
2. Gabriel Vasquez - RM: 557056
3. Gustavo Oliveira - RM: 559163

<a id="como-rodar-o-projeto"></a>

## Como Rodar o Projeto

### Pré-requisitos
- Node.js 16+ (LTS recomendado)
- npm ou yarn
- Expo Go instalado no celular (Android/iOS) **ou** emulador configurado
- Git

### Passo a passo

1. **Clonar o repositório**:
```bash
git clone https://github.com/gvqsilva/fiap-mdi-cp1-cantina-app
cd cantina-app
```

2. **Instalar dependências**:
```bash
npm install
# ou
yarn install
```

3. **Rodar o projeto em desenvolvimento**:
```bash
npx expo start --clear
```

4. **Abrir no dispositivo**:
   - **Android (celular)**: Escanear o QR Code com Expo Go
   - **Android (emulador)**: Pressionar `a` no terminal
   - **iOS (celular)**: Escanear o QR Code com câmera/Expo Go
   - **iOS (macOS)**: Pressionar `i` no terminal

### Testes da Funcionalidade

#### Fluxo de Autenticação
1. Abrir o app → Escolher tipo (Aluno ou Professor)
2. Preencher dados de cadastro (RM/turma ou professorId)
3. Fazer login com o e-mail e senha criados

#### Fluxo de Compra
1. Na Home, visualizar o card hero
2. Clicar em "Ir para o cardápio"
3. Filtrar por categoria
4. Adicionar itens ao carrinho
5. Ver toast de confirmação
6. Ir ao carrinho, ajustar quantidades
7. Ir ao pagamento, confirmar forma de pagamento
8. Ver tela de processamento
9. Receber confirmação do pedido

#### Fluxo de Histórico
1. Ir ao Perfil
2. Ver o histórico de pedidos
3. Filtrar por status (Todos, Em andamento, Concluídos)
4. Buscar por número de pedido
5. Expandir um pedido para ver detalhes
6. Verificar timeline do status
7. Fechar e reabrir o app → Ver status atualizado automaticamente

<a id="demonstracao"></a>

## Demonstração

### Prints das telas (mínimo: uma por tela)
Recomendação: criar a pasta `assets/screenshots` e salvar os prints com nomes padronizados.

Telas implementadas:
- ✅ Home (com hero card)
- ✅ Escolher Tipo (Aluno/Professor)
- ✅ Cadastro (com campos dinâmicos)
- ✅ Login
- ✅ Cardápio (com hero de categoria)
- ✅ Carrinho
- ✅ Pagamento (com fidelidade)
- ✅ Processando Pagamento
- ✅ Pedido (confirmação)
- ✅ Perfil (com filtros, busca e timeline)

### Dados de Teste

**Exemplo - Aluno**:
- E-mail: aluno@fiap.com.br
- Senha: 123456
- RM: 557056
- Turma: 2A

**Exemplo - Professor**:
- E-mail: professor@fiap.com.br
- Senha: 123456
- Código Professor: pf1234

### GIF ou vídeo do fluxo principal
Links para adição:
- GIF: **[inserir link]**
- Vídeo (YouTube/Drive): **[inserir link]**
=======
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
>>>>>>> 25b308c5e209030c185f42e574dd72b49ab34cd6

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
- `useAuth`: hook customizado para gerenciar autenticação e perfil do usuário.
- `useCart`: hook customizado para gerenciar carrinho e histórico de pedidos.

### Estrutura de Arquivos (Arquivos Principais)
```
app/
├── _layout.js                 # Estrutura de navegação e autenticação
├── auth-context.js            # Context de autenticação e perfil
├── cart-context.js            # Context de carrinho e pedidos
├── theme.js                   # Temas e variáveis globais
├── menu-data.js               # Dados de categorias e produtos
│
├── home.js                    # Tela inicial com hero card e quick actions
├── cardapio.js                # Cardápio com filtros e busca
├── carrinho.js                # Revisão do carrinho
├── pagamento.js               # Fluxo de pagamento
├── processando-pagamento.js   # Loading e processamento
├── pedido.js                  # Confirmação do pedido
│
├── auth/
│   ├── escolher-tipo.js       # Seleção de papel (aluno/professor)
│   ├── cadastro.js            # Cadastro com campos dinâmicos
│   └── login.js               # Login
│
└── perfil.js                  # Perfil com histórico e filtros

components/
├── ThemedHeader.js            # Cabeçalho temático
├── PrimaryButton.js           # Botão primário
├── ScreenBackground.js        # Fundo da tela
├── FadeInView.js              # Animação de fade
├── ScalePressable.js          # Botão com animação de scale
└── CardapioSkeleton.js        # Skeleton loading
```

### Navegação
- Abas principais: Home, Cardápio, Carrinho e Perfil.
- Rotas auxiliares: Escolher Tipo (papel), Cadastro, Login, Pagamento, Processando Pagamento e Pedido.
- Autenticação: redirecionamento automático para login/cadastro se não autenticado.
- Fluxo principal autenticado: Home -> Cardápio/Carrinho -> Pagamento -> Processando -> Pedido -> Perfil.
- Fluxo de autenticação: Escolher Tipo -> Cadastro -> Login -> Home.

<a id="diferenciais"></a>

## Diferenciais Implementados (A+)

### 1. Sistema Multi-Papel com Lógicas Diferentes
- **Desafio resolvido**: Permitir dois tipos de usuários com fluxos e benefícios distintos
- **Implementação**:
  - Tela de seleção de papel antes do cadastro
  - Campos dinâmicos no cadastro (RM/turma vs. professorId)
  - Perfis diferentes exibindo dados relevantes
  - **Resultado**: App adapta-se completamente ao tipo de usuário

### 2. Fidelidade Adaptativa por Papel
- **Desafio resolvido**: Implementar sistema de loyalty com thresholds diferentes
- **Implementação**:
  - Aluno: 1 desconto a cada 10 pedidos
  - Professor: 1 desconto a cada 5 pedidos
  - Cálculo automático de desconto no checkout
  - Rastreamento visual no perfil
  - **Resultado**: Incentivo personificado para cada perfil

### 3. Persistência Inteligente de Status
- **Desafio resolvido**: Status de pedido persiste e atualiza automaticamente mesmo após fechar o app
- **Implementação**:
  - Timestamps salvos (previsaoPronto, previsaoConcluido)
  - Recálculo automático ao reabrir a aplicação
  - Atualização de status em tempo real (Em preparação → Pronto → Concluído)
  - **Resultado**: Usuário nunca perde informação do pedido, mesmo offline

### 4. Isolamento Seguro de Dados
- **Desafio resolvido**: Dados privados por usuário, impossibilidade de ver dados de outro usuário
- **Implementação**:
  - AsyncStorage com chaves scoped por email
  - Limpeza de dados ao trocar de usuário
  - Validação em todas as operações
  - **Resultado**: Privacidade garantida

### 5. Interface Avançada com Filtros Dinâmicos
- **Desafio resolvido**: Encontrar pedidos rapidamente em um histórico crescente
- **Implementação**:
  - Filtros por status (Todos, Em andamento, Concluídos)
  - Busca por número de pedido
  - Agrupamento inteligente por data (Hoje, Ontem, Data específica)
  - Timeline visual do progresso
  - **Resultado**: Navegação intuitiva e rápida no histórico

### 6. Benefícios Técnicos Específicos
- **Desafio resolvido**: Professor receber benefício tangível (redução de tempo)
- **Implementação**:
  - Cálculo de 30% redução no tempo de preparo
  - Visualização do tempo restante
  - Badges visuais no histórico
  - **Resultado**: Diferença real entre papéis, incentiva conversão para professor

### 7. Design Moderno e Responsivo
- **Desafio resolvido**: Interface profissional e moderna
- **Implementação**:
  - Animações suaves (FadeInView, ScalePressable)
  - Toast notifications com feedback em tempo real
  - Scroll completo em telas longas
  - Tema dark consistente
  - Cards com visual moderno
  - **Resultado**: UX profissional que aproveita React Native ao máximo

<a id="proximos-passos"></a>

## Próximos Passos

Com mais tempo, o grupo pode evoluir para:

- Integração com backend real (API REST para produtos, pedidos e autenticação).
- Sistema de pagamento real (integração com gateway de pagamento).
- Notificações push para status de pedido pronto.
- Avaliação e comentários em produtos e pedidos.
- Endereço de entrega e entrega em casa.
- Cupons e promoções sazonais.
- Histórico de gastos e estatísticas do usuário.
- Integração com sistemas de CRM da cantina.
- Dark mode/Light mode.
- Multi-idioma (português/inglês).

<a id="tecnologias"></a>

## Tecnologias

### Stack Principal
- **React Native** - Framework para desenvolvimento mobile cross-platform
- **Expo** - Plataforma de desenvolvimento para React Native
- **Expo Router** - Roteamento baseado em arquivos (file-based routing)
- **JavaScript (ES6+)** - Linguagem de programação

### Bibliotecas Principais
- **React Context API** - Gerenciamento de estado global (autenticação, carrinho)
- **AsyncStorage** - Persistência de dados local
- **Expo Linear Gradient** - Gradientes (se utilizados)
- **React Native Animations** - Animações nativas (FadeIn, Scale)

### Padrões de Desenvolvimento
- **Context API** para estado global (AuthContext, CartContext)
- **Custom Hooks** para lógica reutilizável (useAuth, useCart)
- **Composition** para componentes reutilizáveis
- **Memoization** com useMemo e useCallback para performance
- **Async/Await** para operações assíncronas

<a id="status"></a>

## Status

Projeto acadêmico em evolução para a disciplina de Mobile (FIAP).
