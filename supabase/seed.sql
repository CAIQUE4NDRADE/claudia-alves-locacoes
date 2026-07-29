-- Claudia Alves Locações — dados iniciais de exemplo

insert into produtos (codigo, nome, slug, descricao, preco_diaria, preco_promocional, caucao, categoria, tamanhos, cores, imagens, destaque, mais_alugado, status)
values
  ('MA-001', 'Vestido Terracota', 'vestido-terracota', 'Fenda lateral, decote halter e caimento fluido — ideal para casamentos ao ar livre.', 220, null, 300, 'festa', '{P,M,G}', '{Terracota}', '{https://images.unsplash.com/photo-1566174053879-31528523f8ae}', true, true, 'disponivel'),
  ('MA-002', 'Vestido Vinho Imperial', 'vestido-vinho-imperial', 'Decote V profundo em cetim, para quem quer ser a atração da festa.', 250, 210, 350, 'madrinha', '{PP,P,M,G}', '{Vinho}', '{https://images.unsplash.com/photo-1519657337289-077653f724ed}', true, true, 'disponivel'),
  ('MA-003', 'Vestido Verde Esmeralda', 'vestido-verde-esmeralda', 'Um ombro só, tecido acetinado com brilho suave — clássico atemporal.', 240, null, 320, 'festa', '{P,M,G,GG}', '{Verde Esmeralda}', '{https://images.unsplash.com/photo-1594552072238-b8a33785b261}', true, false, 'disponivel'),
  ('MA-004', 'Vestido Azul Royal', 'vestido-azul-royal', 'Corte reto com fenda, tecido acetinado azul royal — elegância certeira para formatura.', 230, null, 300, 'formatura', '{P,M,G}', '{Azul Royal}', '{https://images.unsplash.com/photo-1515372039744-b8f02a3ae446}', true, true, 'disponivel');
