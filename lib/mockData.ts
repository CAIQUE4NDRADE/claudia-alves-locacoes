import type { Produto } from "./supabase";

export const categorias = [
  {
    slug: "festa",
    nome: "Vestidos de Festa",
    quantidade: 38,
    destaque: true,
    imagem: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1000&q=80",
  },
  {
    slug: "madrinha",
    nome: "Madrinha",
    quantidade: 22,
    destaque: false,
    imagem: "https://images.unsplash.com/photo-1519657337289-077653f724ed?w=800&q=80",
  },
  {
    slug: "formatura",
    nome: "Formatura",
    quantidade: 15,
    destaque: false,
    imagem: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=800&q=80",
  },
  {
    slug: "noiva",
    nome: "Noiva",
    quantidade: 6,
    destaque: false,
    imagem: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80",
  },
];

export const produtosDestaque: Produto[] = [
  {
    id: "1",
    nome: "Vestido Terracota",
    slug: "vestido-terracota",
    codigo: "MA-001",
    descricao: "Fenda lateral, decote halter e caimento fluido — ideal para casamentos ao ar livre.",
    preco_diaria: 220,
    preco_promocional: null,
    caucao: 300,
    categoria: "festa",
    tamanhos: ["P", "M", "G"],
    cores: ["Terracota"],
    imagens: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80"],
    destaque: true,
    mais_alugado: true,
    status: "disponivel",
    criado_em: new Date().toISOString(),
  },
  {
    id: "2",
    nome: "Vestido Vinho Imperial",
    slug: "vestido-vinho-imperial",
    codigo: "MA-002",
    descricao: "Decote V profundo em cetim, para quem quer ser a atração da festa.",
    preco_diaria: 250,
    preco_promocional: 210,
    caucao: 350,
    categoria: "madrinha",
    tamanhos: ["PP", "P", "M", "G"],
    cores: ["Vinho"],
    imagens: ["https://images.unsplash.com/photo-1519657337289-077653f724ed?w=800&q=80"],
    destaque: true,
    mais_alugado: true,
    status: "disponivel",
    criado_em: new Date().toISOString(),
  },
  {
    id: "3",
    nome: "Vestido Verde Esmeralda",
    slug: "vestido-verde-esmeralda",
    codigo: "MA-003",
    descricao: "Um ombro só, tecido acetinado com brilho suave — clássico atemporal.",
    preco_diaria: 240,
    preco_promocional: null,
    caucao: 320,
    categoria: "festa",
    tamanhos: ["P", "M", "G", "GG"],
    cores: ["Verde Esmeralda"],
    imagens: ["https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=800&q=80"],
    destaque: true,
    mais_alugado: false,
    status: "disponivel",
    criado_em: new Date().toISOString(),
  },
  {
    id: "4",
    nome: "Vestido Azul Royal",
    slug: "vestido-azul-royal",
    codigo: "MA-004",
    descricao: "Corte reto com fenda, tecido acetinado azul royal — elegância certeira para formatura.",
    preco_diaria: 230,
    preco_promocional: null,
    caucao: 300,
    categoria: "formatura",
    tamanhos: ["P", "M", "G"],
    cores: ["Azul Royal"],
    imagens: ["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80"],
    destaque: true,
    mais_alugado: true,
    status: "disponivel",
    criado_em: new Date().toISOString(),
  },
];

export const depoimentos = [
  {
    nome: "Marina T.",
    ocasiao: "Madrinha de casamento",
    texto: "Aluguei o vestido vinho para o casamento da minha melhor amiga. Chegou impecável e me ajudaram a escolher o tamanho pelo WhatsApp.",
    foto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
  },
  {
    nome: "Beatriz R.",
    ocasiao: "Formatura",
    texto: "Muito mais em conta do que comprar um vestido que eu só usaria uma vez. A qualidade do tecido surpreendeu.",
    foto: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80",
  },
  {
    nome: "Camila S.",
    ocasiao: "Festa de 15 anos da sobrinha",
    texto: "Retirada e devolução super práticas, e a caução foi devolvida no mesmo dia. Já reservei o próximo!",
    foto: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80",
  },
];

export const faq = [
  {
    pergunta: "Como funciona a locação?",
    resposta:
      "Você escolhe o vestido, informa a data do evento e reserva pelo WhatsApp. A retirada costuma ser 1 a 2 dias antes do evento e a devolução em até 2 dias depois.",
  },
  {
    pergunta: "Como funciona a caução?",
    resposta:
      "Cobramos uma caução no ato da retirada, devolvida integralmente após a conferência do vestido, desde que devolvido nas condições combinadas.",
  },
  {
    pergunta: "Posso provar antes de reservar?",
    resposta: "Sim! Agendamos uma prova presencial ou orientamos por vídeo-chamada para quem mora longe.",
  },
  {
    pergunta: "E se o vestido não servir no dia da prova?",
    resposta:
      "Você pode trocar por outro modelo disponível na mesma data, sujeito à disponibilidade do estoque.",
  },
];
