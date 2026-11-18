/* =========================================================
   MINHAS COMPRAS — abas por status e ações do pedido
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const ABAS = [{ id: "tudo", nome: "Tudo" }, ...Object.entries(STATUS_PEDIDO).map(([id, s]) => ({ id, nome: s.nome }))];
  let aba = param("status") || "tudo";
  const lerPedidos = () => Armazem.ler("pedidos", null) || PEDIDOS_PADRAO;
  const salvar = (p) => Armazem.salvar("pedidos", p);

  function renderAbas() {
    const pedidos = lerPedidos();
    $("#abas").innerHTML = ABAS.map((a) => {
      const qtd = a.id === "tudo" ? 0 : pedidos.filter((p) => p.status === a.id).length;
      return `<button class="aba ${a.id === aba ? "ativo" : ""}" role="tab" aria-selected="${a.id === aba}" data-aba="${a.id}">${a.nome}${qtd && ["a-pagar", "preparando", "a-caminho"].includes(a.id) ? `<small>${qtd}</small>` : ""}</button>`;
    }).join("");
  }

  function acoesPara(p) {
    const btn = (acao, texto, primario) => `<button class="botao botao--sm ${primario ? "botao--primario" : "botao--contorno"}" data-acao="${acao}" data-pedido="${p.id}">${texto}</button>`;
    switch (p.status) {
      case "a-pagar": return btn("pagar", "Pagar Agora", true) + btn("cancelar", "Cancelar Pedido");
      case "preparando": return btn("chat", "Falar Com Vendedor") + btn("cancelar", "Cancelar Pedido");
      case "a-caminho": return btn("recebido", "Confirmar Recebimento", true) + btn("chat", "Falar Com Vendedor");
      case "finalizado": return btn("novamente", "Comprar Novamente", true) + btn("avaliar", "Avaliar") + btn("chat", "Falar Com Vendedor");
      default: return btn("novamente", "Comprar Novamente", true) + btn("chat", "Falar Com Vendedor");
    }
  }

  function render() {
    renderAbas();
    const pedidos = lerPedidos().filter((p) => aba === "tudo" || p.status === aba);
    $("#pedidos").innerHTML = pedidos.length ? pedidos.map((p) => {
      const loja = lojaPorId(p.loja);
      const st = STATUS_PEDIDO[p.status];
      const total = p.itens.reduce((s, i) => s + produtoPorId(i.id).preco * i.qtd, 0);
      return `<article class="cartao pedido">
        <div class="pedido__topo"><strong>${loja.nome}</strong><span class="pedido__status">${icone(st.icone)} ${st.aviso}</span><span class="pedido__etiqueta">${st.nome}</span></div>
        ${p.itens.map((i) => {
          const prod = produtoPorId(i.id);
          return `<a class="pedido__item" href="produto.html?id=${prod.id}"><img src="${prod.img}" alt=""><div><h4>${escapar(prod.nome.length > 45 ? prod.nome.slice(0, 45) + "…" : prod.nome)}</h4><small>Variação: ${escapar(i.variacao || "Única")} · x${i.qtd}</small></div><span class="preco">${moeda(prod.preco * i.qtd)}</span></a>`;
        }).join("")}
        <div class="pedido__total">Total do Pedido: <strong>${moeda(total)}</strong></div>
        <div class="pedido__acoes">${acoesPara(p)}</div>
      </article>`;
    }).join("") : `<div class="cartao vazio">${icone("bag")}<h3>Nenhum pedido aqui</h3><p>Quando você comprar, seus pedidos aparecem nesta aba.</p><a class="botao botao--primario" href="index.html">Ir às compras</a></div>`;
  }

  $("#abas").addEventListener("click", (e) => {
    const b = e.target.closest("[data-aba]"); if (!b) return;
    aba = b.dataset.aba;
    history.replaceState(null, "", aba === "tudo" ? "minhas-compras.html" : `?status=${aba}`);
    render();
  });

  $("#pedidos").addEventListener("click", (e) => {
    const b = e.target.closest("[data-acao]"); if (!b) return;
    e.preventDefault();
    const pedidos = lerPedidos();
    const p = pedidos.find((x) => x.id === b.dataset.pedido);
    const mudar = (status, msg, texto) => {
      p.status = status; salvar(pedidos); toast(msg);
      Notificacoes.adicionar({ titulo: msg, texto, link: `minhas-compras.html?status=${status}`, img: produtoPorId(p.itens[0].id).img });
    };
    const loja = lojaPorId(p.loja).nome;
    switch (b.dataset.acao) {
      case "pagar": mudar("preparando", "Pagamento confirmado!", `Seu pedido da ${loja} foi pago e já está sendo preparado.`); break;
      case "recebido": mudar("finalizado", "Pedido finalizado. Avalie e ganhe moedas!", `Você confirmou o recebimento do pedido da ${loja}.`); break;
      case "chat": location.href = `chat.html?loja=${p.loja}`; break;
      case "avaliar": abrirFormAvaliacao(p.itens[0].id); break;
      case "novamente":
        p.itens.forEach((i) => Carrinho.adicionar(i.id, i.qtd, i.variacao));
        toast("Itens adicionados ao carrinho", "cart");
        setTimeout(() => (location.href = "carrinho.html"), 700);
        break;
      case "cancelar": {
        const modal = abrirModal({
          titulo: "Cancelar pedido",
          corpo: `<div class="campo"><label for="motivo">Motivo do cancelamento</label><select id="motivo"><option>Mudei de ideia</option><option>Encontrei mais barato</option><option>Errei o endereço</option><option>Outro</option></select></div>`,
          acoes: `<button class="botao botao--contorno" data-fechar>Voltar</button><button class="botao botao--primario" id="confirmar-cancel">Cancelar pedido</button>`,
        });
        $("#confirmar-cancel", modal).addEventListener("click", () => { fecharModal(); mudar("cancelado", "Pedido cancelado", `Seu pedido da ${loja} foi cancelado (${$("#motivo", modal).value}).`); });
      }
    }
  });

  aoMudar(["pedidos"], render);
  render();
});
