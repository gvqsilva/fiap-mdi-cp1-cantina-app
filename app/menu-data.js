const IMAGEM_COXINHA = require('../assets/coxinha.jpg');
const IMAGEM_PAO_QUEIJO = require('../assets/pao-queijo.jpg');
const IMAGEM_BOLO = require('../assets/bolo.jpg');
const IMAGEM_COCA = require('../assets/coca.jpg');
const IMAGEM_COMBO1 = require('../assets/combo1.webp');
const IMAGEM_COCAZ = require('../assets/coca-zero.webp');
const IMAGEM_CROISSANTCHOCO = require('../assets/croissants-choco.jpg');
const IMAGEM_CROISSANTFRANGO = require('../assets/croissants-frango.jpg');
const IMAGEM_CROISSANTPQ = require('../assets/croissants-presunto_queijo.jpg');
const IMAGEM_ESFIRRA = require('../assets/esfirra-carne.jpg');
const IMAGEM_COOKIE = require('../assets/cookie.jpg');
const IMAGEM_CAFEP = require('../assets/cafe-p.webp');
const IMAGEM_CAFEM = require('../assets/cafe-m.jpg');
const IMAGEM_AGUACOM = require('../assets/agua-com.webp');
const IMAGEM_AGUA = require('../assets/agua.webp');

export const CATEGORIAS = ['Tudo', 'Salgado', 'Doce', 'Bebidas', 'Combos'];

export const PRODUTOS = [
  {
    id: 1,
    nome: 'Coxinha de frango',
    descricao: '',
    valor: 'R$ 10,00',
    categoria: 'Salgado',
    imagem: IMAGEM_COXINHA,
  },
  {
    id: 2,
    nome: 'Pão de queijo',
    descricao: '',
    valor: 'R$ 8,50',
    categoria: 'Salgado',
    imagem: IMAGEM_PAO_QUEIJO,
  },
  {
    id: 3,
    nome: 'Coca-Cola',
    descricao: '350ml',
    valor: 'R$ 6,00',
    categoria: 'Bebidas',
    imagem: IMAGEM_COCA,
  },
  {
    id: 4,
    nome: 'Bolo de Cenoura',
    descricao: '',
    valor: 'R$ 6,00',
    categoria: 'Doce',
    imagem: IMAGEM_BOLO,
  },
  {
    id: 5,
    nome: 'Água',
    descricao: '500ml',
    valor: 'R$ 4,50',
    categoria: 'Bebidas',
    imagem: IMAGEM_AGUA,
  },
  {
    id: 6,
    nome: 'Café Pequeno',
    descricao: '50ml',
    valor: 'R$ 4,00',
    categoria: 'Bebidas',
    imagem: IMAGEM_CAFEP,
  },
  {
    id: 7,
    nome: 'Pão de queijo + Café',
    descricao: 'Combo de Pão de Queijo com Café Médio, 100ml',
    valor: 'R$ 15,00',
    categoria: 'Combos',
    imagem: IMAGEM_COMBO1,
  },
  {
    id: 8,
    nome: 'Coca-Cola Zero',
    descricao: '350ml',
    valor: 'R$ 6,00',
    categoria: 'Bebidas',
    imagem: IMAGEM_COCAZ,
  },
  {
    id: 9,
    nome: 'Cookie',
    descricao: '',
    valor: 'R$ 7,50',
    categoria: 'Doce',
    imagem: IMAGEM_COOKIE,
  },
  {
    id: 10,
    nome: 'Café Médio',
    descricao: '100ml',
    valor: 'R$ 5,50',
    categoria: 'Bebidas',
    imagem: IMAGEM_CAFEM,
  },
  {
    id: 11,
    nome: 'Croissant de chocolate',
    descricao: '',
    valor: 'R$ 12,50',
    categoria: 'Doce',
    imagem: IMAGEM_CROISSANTCHOCO,
  },
  {
    id: 12,
    nome: 'Croissant de frango',
    descricao: '',
    valor: 'R$ 12,00',
    categoria: 'Salgado',
    imagem: IMAGEM_CROISSANTFRANGO,
  },
  {
    id: 13,
    nome: 'Água com gás',
    descricao: '500ml',
    valor: 'R$ 5,50',
    categoria: 'Bebidas',
    imagem: IMAGEM_AGUACOM,
  },
  {
    id: 14,
    nome: 'Croissant de presunto e queijo',
    descricao: '',
    valor: 'R$ 12,00',
    categoria: 'Salgado',
    imagem: IMAGEM_CROISSANTPQ,
  },
  {
    id: 15,
    nome: 'Esfirra de carne',
    descricao: '',
    valor: 'R$ 12,00',
    categoria: 'Salgado',
    imagem: IMAGEM_ESFIRRA,
  },
];

export const DESTAQUES_IDS = [1, 2, 3, 7, 11];
export const PRODUTOS_DESTAQUE = PRODUTOS.filter((produto) => DESTAQUES_IDS.includes(produto.id));
