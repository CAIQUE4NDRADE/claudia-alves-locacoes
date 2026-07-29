# Claudia Alves Locações — Site

Site de **locação** de vestidos (festa, madrinha, formatura e noiva),
construído em Next.js 14 (App Router) + Tailwind + Supabase (banco + auth) +
confirmação de reserva via WhatsApp + painel admin.

## 🎨 Sistema de design

- **Cores**: marfim quente `#FBF7F1` (fundo), carvão `#2A241E` (texto),
  dourado envelhecido `#A9813F` (assinatura da marca) e bordô `#6E1F2B`
  (contraste/urgência em CTAs). A base é intencionalmente neutra para que a
  cor de cada vestido (terracota, vinho, esmeralda, azul royal...) seja o
  verdadeiro protagonista visual, como no catálogo real da marca.
- **Tipografia**: `Fraunces` (display, serifada com personalidade editorial)
  + `Manrope` (texto, geométrica e limpa).
- **Assinatura visual**: `StitchLine` — um fio pontilhado em SVG que se
  "costura" conforme a seção entra na tela, remetendo à alfaiataria/atelier.

## 🛠️ Rodando localmente

```bash
npm install
cp .env.example .env.local
npm run dev
```

## 🗄️ Banco de dados (Supabase)

1. Crie um projeto em supabase.com.
2. No SQL Editor, rode nesta ordem:
   1. `supabase/schema.sql` — cria `produtos` (vestidos), `clientes`,
      `reservas` e `despesas`.
   2. `supabase/policies.sql` — políticas de acesso recomendadas (catálogo
      público, tudo o mais restrito a admins autenticados).
   3. `supabase/seed.sql` — alguns vestidos de exemplo.
3. Crie um bucket público chamado `produtos` em **Storage** para as fotos.
4. Crie o primeiro usuário admin em **Authentication → Users**, copie o UUID
   e rode:
   ```sql
   insert into usuarios_admin (id, nome, papel)
   values ('COLE_O_UUID_AQUI', 'Claudia', 'admin');
   ```

### Testando rápido, sem login (opcional)

Se você só quer validar o catálogo com a Claudia antes de configurar login,
pode rodar `supabase/policies-mvp-aberto.sql` no lugar de `policies.sql` —
ele libera leitura/escrita pública em todas as tabelas. **Troque para
`policies.sql` antes de divulgar o link publicamente**, porque
`policies-mvp-aberto.sql` deixa dados de cliente (CPF, endereço, contato)
acessíveis com a chave pública do site.

Sem nenhum Supabase configurado, o app inteiro roda em **modo
demonstração**: os dados vêm de `lib/mockData.ts`, nada é salvo de verdade,
e um aviso deve aparecer no painel admin (ver próximos incrementos).

## 🏷️ Ficha técnica do vestido (acervo)

Além dos campos que aparecem no site público, `produtos` guarda o que a loja
precisa para gerir o acervo: `codigo` (etiqueta física da peça), `marca`,
`colecao`, `tecido`, `fornecedor`, `valor_compra`/`valor_venda` (caso uma
peça saia da locação e vá para venda), `data_compra`, `ultima_lavagem`,
`ultimo_ajuste` e `observacoes`. O campo `status` (`disponivel` / `alugado`
/ `manutencao` / `lavanderia`) é mais rico que um simples booleano de
estoque — reflete o ciclo real de uma peça de locação.

## 👤 Clientes e financeiro

- `clientes`: CRM básico (nome, CPF, telefone, WhatsApp, e-mail, Instagram,
  endereço, observações) — nunca público, sempre atrás de login.
- `despesas`: lavanderia, ajuste/costura, compra de peça, marketing etc. —
  base para um dashboard financeiro simples (receita das reservas menos
  despesas do período).
- `reservas` distingue **sinal** (valor pago para confirmar a reserva,
  abatido do total) de **caução** (valor devolvido após a conferência do
  vestido) — são coisas diferentes e é comum confundir os dois.

## 🔑 A diferença central: locação, não venda

Diferente de uma loja comum, aqui **não existe "estoque" em quantidade** —
existe **disponibilidade por data**. Cada vestido só pode ter uma reserva
ativa por período. Por isso:

- A tabela `reservas` guarda `data_evento`, `data_retirada` e
  `data_devolucao` por pedido.
- A função `produto_disponivel(produto_id, retirada, devolucao)` no banco
  verifica se já existe uma reserva confirmada que colide com o período
  pedido — é o "trigger de estoque" desse tipo de negócio.
- O checkout cobra dois valores: o **valor da locação** (não devolvido) e a
  **caução** (devolvida após a conferência do vestido).

## ✅ O que já está pronto

- Home completa com linguagem de locação (hero, selos de confiança
  específicos — prova, reserva por data, caução devolvida —, categorias em
  bento grid, mais alugados, como funciona a locação, depoimentos, FAQ, CTA
  final).
- Listagem de vestidos com filtro por categoria.
- Página de vestido com seleção de tamanho e datas (evento, retirada,
  devolução).
- "Minhas reservas" (equivalente ao carrinho) e checkout que monta a
  mensagem da reserva — com as datas e os valores de locação/caução — e abre
  o WhatsApp já preenchido.
- Schema de banco com disponibilidade por data (sem duplo-booking) e função
  de checagem de conflito.
- Login do admin via Supabase Auth.

## 🔜 Próximos incrementos sugeridos

- Chamar `checarDisponibilidade()` (já pronta em `lib/api.ts`, via RPC
  `produto_disponivel`) no front antes de liberar o botão "Reservar este
  vestido", mostrando um aviso se a data já estiver ocupada.
- Telas de CRUD no painel admin usando as funções já prontas em
  `lib/api.ts`: vestidos (com upload de imagem e a ficha técnica completa),
  clientes, reservas (mudança de status: Solicitada → Confirmada →
  Retirada → Devolvida) e despesas.
- Dashboard com faturamento do período (soma de `valor_locacao` das
  reservas confirmadas/devolvidas menos `despesas`), calendário de
  disponibilidade por vestido e vestidos mais alugados.
- Login obrigatório (Supabase Auth) protegendo todo o painel admin — hoje
  só a tela de login existe; falta redirecionar quem não estiver
  autenticado para longe de `/admin/dashboard`.
- Um aviso visível no admin quando `supabaseConfigurado` (exportado de
  `lib/supabase.ts`) for `false`, avisando que o app está em modo
  demonstração — mesmo padrão do aviso amarelo da Milê Atelier.
- Ícones reais `icon-192.png`/`icon-512.png` em `/public`.

## 📈 Estratégias de conversão aplicadas

- **CTA duplo no hero**: "Ver coleção" + "Falar no WhatsApp" — atende quem
  já sabe o vestido que quer e quem prefere confirmar disponibilidade
  primeiro.
- **Selos de confiança específicos de locação**: prova com acompanhamento,
  reserva por data e caução devolvida — resolvem as três maiores objeções
  de quem nunca alugou um vestido antes.
- **Depoimentos por ocasião** (madrinha, formatura, festa de 15 anos):
  ajudam quem está alugando para uma data importante a se identificar.
- **Checkout com datas explícitas**: reduz o vai-e-vem de mensagens no
  WhatsApp, já que a cliente informa evento, retirada e devolução antes de
  falar com a Claudia.

## 🔍 Estratégias de SEO aplicadas

- Metadata com foco em intenção de aluguel ("aluguel de vestido de festa",
  "vestido de madrinha para alugar").
- Open Graph configurado para compartilhamento em redes sociais.
- Estrutura de URLs por categoria (`/produtos?categoria=formatura`) e por
  vestido (`/produto/[slug]`).
- Imagens com `alt` descritivo em todos os componentes.
