import type { Cliente, Produto, Reserva } from "./supabase";

// Dados fixos da loja — ajuste aqui se a razão social, cidade ou comarca mudar.
const LOCADORA_NOME = "Claudia Alves Locações";
const LOCADORA_CIDADE = "Campinas/SP";
const COMARCA = "Comarca de Campinas/SP";

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarData(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR");
}

function hoje() {
  return new Date().toLocaleDateString("pt-BR");
}

/** Célula em branco pra preencher à mão quando o dado não existe no cadastro. */
const BRANCO = "___________________________";

/**
 * Abre uma nova aba com o contrato de locação já formatado, seguindo o
 * padrão de cláusulas numeradas (objeto, prazo, valor, entrega/devolução,
 * conservação/danos, desistência, foro), pronto pra imprimir ou salvar
 * como PDF.
 */
export function gerarContrato(reserva: Reserva, produto: Produto | undefined, cliente: Cliente | undefined) {
  const total = reserva.valor_locacao;
  const saldo = Math.max(0, total - reserva.sinal);

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<title>Contrato de Locação — ${cliente?.nome ?? "Cliente"}</title>
<style>
  * { box-sizing: border-box; }
  body {
    font-family: Georgia, "Times New Roman", serif;
    color: #2A241E;
    max-width: 760px;
    margin: 40px auto;
    padding: 0 24px;
    line-height: 1.6;
    font-size: 13.5px;
  }
  h1 {
    font-size: 19px;
    text-align: center;
    margin-bottom: 2px;
    letter-spacing: 0.02em;
  }
  .subtitulo {
    text-align: center;
    font-size: 12px;
    color: #6b6258;
    margin-bottom: 26px;
  }
  h2 {
    font-size: 13.5px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    border-bottom: 1px solid #d8d0c4;
    padding-bottom: 4px;
    margin-top: 22px;
    margin-bottom: 10px;
  }
  p.corpo { margin: 0 0 10px; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 8px; }
  td { padding: 4px 0; vertical-align: top; border-bottom: 1px solid #eee6d8; }
  tr:last-child td { border-bottom: none; }
  td.label { color: #6b6258; width: 42%; }
  .clausula { font-size: 12.5px; }
  .clausula p { margin: 0 0 8px; }
  .declaracao {
    margin-top: 30px;
    font-size: 12.5px;
    text-align: center;
  }
  .data-local {
    margin-top: 6px;
    text-align: center;
    font-size: 12.5px;
  }
  .assinaturas {
    display: flex;
    justify-content: space-between;
    margin-top: 56px;
    gap: 32px;
  }
  .assinatura {
    flex: 1;
    text-align: center;
    font-size: 12px;
  }
  .assinatura .nome-loja { font-weight: bold; }
  .linha {
    border-top: 1px solid #2A241E;
    margin-bottom: 6px;
    padding-top: 40px;
  }
  .rodape-aviso {
    margin-top: 34px;
    padding-top: 12px;
    border-top: 1px solid #d8d0c4;
    font-size: 10.5px;
    color: #8a8071;
    text-align: center;
  }
  @media print {
    body { margin: 0; padding: 0 12px; }
    .no-print { display: none; }
  }
  .no-print {
    text-align: center;
    margin-bottom: 24px;
  }
  .no-print button {
    font-family: sans-serif;
    background: #2A241E;
    color: #FBF7F1;
    border: none;
    border-radius: 999px;
    padding: 10px 24px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
  }
</style>
</head>
<body>
  <div class="no-print"><button onclick="window.print()">Imprimir / Salvar PDF</button></div>

  <h1>Contrato de Reserva e Locação de Vestido</h1>
  <p class="subtitulo">${LOCADORA_NOME} — Locação de Vestidos · ${LOCADORA_CIDADE}</p>

  <h2>Locadora</h2>
  <p class="corpo">
    ${LOCADORA_NOME}, representada por ${BRANCO} (nome completo), inscrita no CPF nº ${BRANCO},
    com endereço em ${BRANCO}, ${LOCADORA_CIDADE}, doravante <strong>LOCADORA</strong>.
  </p>

  <h2>Locatária</h2>
  <table>
    <tr><td class="label">Nome</td><td>${cliente?.nome ?? "—"}</td></tr>
    <tr><td class="label">CPF</td><td>${cliente?.cpf || BRANCO}</td></tr>
    <tr><td class="label">RG</td><td>${BRANCO}</td></tr>
    <tr><td class="label">Telefone</td><td>${cliente?.whatsapp || cliente?.telefone || "—"}</td></tr>
    <tr><td class="label">Endereço</td><td>${cliente?.endereco || BRANCO}</td></tr>
  </table>
  <p class="corpo">
    Doravante denominada <strong>LOCATÁRIA</strong>. As partes celebram o presente Contrato mediante as
    cláusulas a seguir.
  </p>

  <h2>Cláusula I — Do objeto</h2>
  <table>
    <tr><td class="label">Vestido</td><td>${produto?.nome ?? "—"}${produto?.codigo ? ` (${produto.codigo})` : ""}</td></tr>
    <tr><td class="label">Cor / Tamanho</td><td>${reserva.cor || "—"} / ${reserva.tamanho}</td></tr>
    <tr><td class="label">Valor de mercado do vestido</td><td>${produto?.valor_venda ? formatarPreco(produto.valor_venda) : BRANCO}</td></tr>
    <tr><td class="label">Ajustes realizados</td><td>${BRANCO}</td></tr>
  </table>
  <div class="clausula">
    <p>1.1. Os ajustes solicitados não podem alterar o modelo do vestido (ex.: cortes de tecido). A locatária é
    responsável pelas medidas informadas, que devem ser enviadas com no mínimo 10 dias de antecedência ao início
    da locação.</p>
  </div>

  <h2>Cláusula II — Do prazo</h2>
  <table>
    <tr><td class="label">Início da locação (retirada)</td><td>${formatarData(reserva.data_retirada)}</td></tr>
    <tr><td class="label">Término da locação (devolução)</td><td>${formatarData(reserva.data_devolucao)}</td></tr>
  </table>
  <div class="clausula">
    <p>2.1. A prorrogação depende de solicitação por escrito (WhatsApp/e-mail) e concordância da locadora, com
    novo valor acordado entre as partes.</p>
  </div>

  <h2>Cláusula III — Do valor</h2>
  <table>
    <tr><td class="label">Valor da locação</td><td>${formatarPreco(total)}</td></tr>
    <tr><td class="label">Caução</td><td>${formatarPreco(reserva.valor_caucao)}</td></tr>
    <tr><td class="label">Sinal pago</td><td>${formatarPreco(reserva.sinal)}</td></tr>
    <tr><td class="label">Saldo na retirada</td><td>${formatarPreco(saldo)}</td></tr>
  </table>
  <div class="clausula">
    <p>3.1. O saldo deverá ser quitado até a retirada do vestido. A caução, quando aplicável, é devolvida
    integralmente após a conferência da peça na devolução.</p>
  </div>

  <h2>Cláusula IV — Da entrega e devolução</h2>
  <div class="clausula">
    <p>4.1. O vestido é entregue limpo e em bom estado. A locatária tem 24 horas após o recebimento para apontar
    qualquer irregularidade; vencido o prazo, considera-se recebido em perfeito estado.</p>
    <p>4.2. A devolução deve ocorrer até a data de término, entre 10h e 18h. A devolução antecipada não gera
    desconto ou reembolso.</p>
    <p>4.3. Atraso na devolução: cobrança da diária proporcional ao valor da locação, acrescida de multa de 50%
    sobre esse valor por dia, a título de lucros cessantes, até a efetiva devolução.</p>
  </div>

  <h2>Cláusula V — Da conservação, danos e limpeza</h2>
  <div class="clausula">
    <p>5.1. A locatária compromete-se a devolver a peça nas mesmas condições em que a recebeu, ressalvado o
    desgaste natural do uso.</p>
    <p>5.2. Não é permitido à locatária realizar qualquer limpeza no vestido, nem uso de ferro de passar, sob
    pena de responsabilização.</p>
    <p>5.3. Lavagem especial: constatada mancha de difícil remoção, a locatária arcará com o valor de lavagem
    especial informado pela locadora, mediante fotos comprobatórias em até 48h da devolução.</p>
    <p>5.4. Danos: em caso de dano reparável, multa de até 3 aluguéis do vestido. Se o dano for irreparável ou
    houver extravio, a locatária pagará o valor de mercado do vestido indicado na Cláusula I.</p>
  </div>

  <h2>Cláusula VI — Da desistência</h2>
  <div class="clausula">
    <p>6.1. A desistência deve ser comunicada por escrito e dará direito a crédito (voucher) para uso futuro,
    conforme a antecedência: até 15 dias antes da retirada, 100% do valor; entre 15 e 7 dias, 75%; com 7 dias ou
    menos, 50%. O voucher é pessoal, intransferível e válido por 12 meses.</p>
  </div>

  <h2>Cláusula VII — Do foro</h2>
  <div class="clausula">
    <p>7.1. Fica eleito o foro da ${COMARCA} para dirimir quaisquer questões oriundas deste contrato.</p>
  </div>

  <p class="declaracao">A locatária declara que leu e concorda com todas as cláusulas deste contrato.</p>
  <p class="data-local">${LOCADORA_CIDADE}, ${hoje()}.</p>

  <div class="assinaturas">
    <div class="assinatura"><div class="linha"></div><span class="nome-loja">LOCADORA</span><br />${LOCADORA_NOME}</div>
    <div class="assinatura"><div class="linha"></div><span class="nome-loja">LOCATÁRIA</span><br />${cliente?.nome ?? "—"}</div>
  </div>

  <p class="rodape-aviso">
    Modelo de contrato gerado automaticamente pelo sistema ${LOCADORA_NOME}. Antes de usar com clientes,
    recomenda-se revisão por um advogado — os valores de multa, caução e lavagem especial devem ser confirmados
    conforme a política da loja.
  </p>
</body>
</html>`;

  const janela = window.open("", "_blank");
  if (!janela) return;
  janela.document.write(html);
  janela.document.close();
}
