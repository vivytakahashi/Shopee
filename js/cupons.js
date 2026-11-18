/* =========================================================
   CUPONS — resgatar cupons e ver condições
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const area = $("#secoes-cupons");

  function render() {
    const resgatados = Armazem.ler("cupons_resgatados", []);
    const secoes = [...new Set(CUPONS.map((c) => c.secao))];
    area.innerHTML = secoes.map((secao) => `<section class="cartao cupons-secao"><h2>${secao}</h2><div class="cupons-grade">
      ${CUPONS.filter((c) => c.secao === secao).map((c) => {
        const ok = resgatados.includes(c.id);
        return `<article class="cupom ${ok ? "resgatado" : ""}">
          <div class="cupom__marca ${c.fraca ? "cupom__marca--fraca" : ""}"><span>${icone("percent")}</span><span>${c.marca}</span></div>
          <div class="cupom__valor">${moeda(c.desconto).replace(" ", "")} de desconto</div>
          <div class="cupom__min">Compras acima de ${moeda(c.minimo).replace(" ", "")}</div>
          <div class="cupom__validade">Válido até ${c.validade}</div>
          <div class="cupom__rodape"><button data-condicoes="${c.id}">Condições</button>
            <button class="botao ${ok ? "botao--verde" : "botao--primario"}" data-quero="${c.id}" ${ok ? "disabled" : ""}>${ok ? "Resgatado" : "Quero"}</button></div>
        </article>`;
      }).join("")}</div></section>`).join("");
  }

  area.addEventListener("click", (e) => {
    const quero = e.target.closest("[data-quero]");
    if (quero) {
      const lista = Armazem.ler("cupons_resgatados", []);
      if (lista.includes(quero.dataset.quero)) return;
      lista.push(quero.dataset.quero);
      Armazem.salvar("cupons_resgatados", lista);
      const c = CUPONS.find((x) => x.id === quero.dataset.quero);
      Notificacoes.adicionar({ titulo: "Cupom resgatado", texto: `${moeda(c.desconto)} de desconto · ${c.marca}. Use no pagamento em compras acima de ${moeda(c.minimo)}.`, link: "pagamento.html", icone: "percent" });
      toast("Cupom resgatado! Use no pagamento", "percent");
    }
    const cond = e.target.closest("[data-condicoes]");
    if (cond) {
      const c = CUPONS.find((x) => x.id === cond.dataset.condicoes);
      abrirModal({
        titulo: "Condições do cupom",
        corpo: `<p><strong>${moeda(c.desconto)} de desconto</strong> · ${c.marca}</p>
          <p>• Válido para compras acima de ${moeda(c.minimo)}.</p><p>• Válido até ${c.validade}, ou enquanto durarem os estoques.</p>
          <p>• Limitado a 1 uso por conta.</p><p>• Não cumulativo com outros cupons Shopee.</p>`,
        acoes: `<button class="botao botao--primario" data-fechar>Entendi</button>`,
      });
    }
  });

  aoMudar(["cupons_resgatados"], render);
  render();
});
