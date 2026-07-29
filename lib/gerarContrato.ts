import type { Cliente, Produto, Reserva } from "./supabase";

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarData(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR");
}

/**
 * Abre uma nova aba com o contrato de locação já formatado e pronto pra
 * imprimir (ou salvar como PDF via Ctrl+P / Cmd+P no navegador).
 */
export function gerarContrato(reserva: Reserva, produto: Produto | undefined, cliente: Cliente | undefined) {
  const total = reserva.valor_locacao;
  const restante = Math.max(0, total - reserva.sinal);

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
    max-width: 720px;
    margin: 40px auto;
    padding: 0 24px;
    line-height: 1.6;
  }
  h1 {
    font-size: 20px;
    text-align: center;
    margin-bottom: 4px;
    letter-spacing: 0.03em;
  }
  .subtitulo {
    text-align: center;
    font-size: 12px;
    color: #6b6258;
    margin-bottom: 28px;
  }
  h2 {
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    border-bottom: 1px solid #d8d0c4;
    padding-bottom: 4px;
    margin-top: 24px;
    margin-bottom: 10px;
  }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  td { padding: 3px 0; vertical-align: top; }
  td.label { color: #6b6258; width: 40%; }
  .clausulas { font-size: 12.5px; }
  .clausulas p { margin: 0 0 10px; }
  .assinaturas {
    display: flex;
    justify-content: space-between;
    margin-top: 64px;
    gap: 32px;
  }
  .assinatura {
    flex: 1;
    text-align: center;
    font-size: 12px;
  }
  .linha {
    border-top: 1px solid #2A241E;
    margin-bottom: 6px;
    padding-top: 40px;
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
  <div class="no-print"><button onclick="window.print()">Imprimir / salvar como PDF</button></div>

  <h1>Contrato de Locação de Vestido</h1>
  <p class="subtitulo">Claudia Alves Locações</p>

  <h2>Locatária</h2>
  <table>
    <tr><td class="label">Nome</td><td>${cliente?.nome ?? "—"}</td></tr>
    <tr><td class="label">CPF</td><td>${cliente?.cpf || "—"}</td></tr>
    <tr><td class="label">Telefone / WhatsApp</td><td>${cliente?.whatsapp || cliente?.telefone || "—"}</td></tr>
    <tr><td class="label">Endereço</td><td>${cliente?.endereco || "—"}</td></tr>
  </table>

  <h2>Peça locada</h2>
  <table>
    <tr><td class="label">Vestido</td><td>${produto?.nome ?? "—"}${produto?.codigo ? ` (cód. ${produto.codigo})` : ""}</td></tr>
    <tr><td class="label">Tamanho</td><td>${reserva.tamanho}</td></tr>
    <tr><td class="label">Cor</td><td>${reserva.cor || "—"}</td></tr>
    <tr><td class="label">Evento</td><td>${reserva.evento || "—"} — ${formatarData(reserva.data_evento)}</td></tr>
  </table>

  <h2>Período e valores</h2>
  <table>
    <tr><td class="label">Retirada</td><td>${formatarData(reserva.data_retirada)}</td></tr>
    <tr><td class="label">Devolução</td><td>${formatarData(reserva.data_devolucao)}</td></tr>
    <tr><td class="label">Valor da locação</td><td>${formatarPreco(total)}</td></tr>
    <tr><td class="label">Sinal pago</td><td>${formatarPreco(reserva.sinal)}</td></tr>
    <tr><td class="label">Valor restante (na retirada)</td><td>${formatarPreco(restante)}</td></tr>
    <tr><td class="label">Caução (devolvida na conferência)</td><td>${formatarPreco(reserva.valor_caucao)}</td></tr>
  </table>

  <h2>Termos</h2>
  <div class="clausulas">
    <p>1. A peça deve ser devolvida na data acima, em condições de uso normal. Danos, manchas ou rasgos causados por mau uso serão descontados da caução.</p>
    <p>2. O sinal pago confirma a reserva e não é reembolsável em caso de desistência da locatária.</p>
    <p>3. O valor restante deve ser quitado no momento da retirada da peça.</p>
    <p>4. A caução é devolvida integralmente em até 48h após a devolução, mediante conferência do estado da peça.</p>
    <p>5. O atraso na devolução gera cobrança de diária adicional proporcional ao valor da locação.</p>
  </div>

  <div class="assinaturas">
    <div class="assinatura"><div class="linha"></div>Claudia Alves Locações</div>
    <div class="assinatura"><div class="linha"></div>${cliente?.nome ?? "Locatária"}</div>
  </div>
</body>
</html>`;

  const janela = window.open("", "_blank");
  if (!janela) return;
  janela.document.write(html);
  janela.document.close();
}
