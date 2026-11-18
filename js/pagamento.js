/* =========================================================
   PAGAMENTO — endereço, envios, cupons, moedas, resumo,
   método de pagamento e criação do pedido
   ========================================================= */
const FRETE_EXPRESSO = 14.9;
const TAXA_IMPORTACAO = 0.2; // 20% sobre produtos internacionais
const TAXA_ICMS = 0.17;      // 17% sobre (produto internacional + imposto)
const LIMITE_MOEDAS = 0.25;  // moedas pagam até 25% do pedido
const CUPONS_LOJA = { LOJA10: { tipo: "pct", valor: 0.1, nome: "10% OFF" }, FRETEGRATIS: { tipo: "frete", nome: "Frete grátis" } };

document.addEventListener("DOMContentLoaded", () => {
  /* De onde vêm os itens:
     - { origem: "carrinho" }  → lê AO VIVO os itens selecionados do carrinho
       (mudar a quantidade aqui muda no carrinho, e vice-versa);
     - { origem: "agora", itens } → botão "Comprar Agora" da página do produto. */
  const lerCheckout = () => {
    const c = Armazem.ler("checkout", null);
    if (Array.isArray(c)) return c.length && !c[0].doCarrinho ? { origem: "agora", itens: c } : { origem: "carrinho" }; // formato antigo
    return c && c.origem === "agora" && Array.isArray(c.itens) ? c : { origem: "carrinho" };
  };
  function itensAtuais() {
    const c = lerCheckout();
    if (c.origem === "agora") return c.itens.filter((i) => produtoPorId(i.id)).map((i) => ({ ...i }));
    return Carrinho.itens().filter((i) => i.selecionado && produtoPorId(i.id)).map(({ id, qtd, variacao }) => ({ id, qtd, variacao, doCarrinho: true }));
  }

  const pagina = $("#pagamento");
  pagina.insertAdjacentHTML("afterend", `<div class="cartao vazio oculto" id="pagamento-vazio">${icone("cart")}<h3>Nenhum produto para pagar</h3><p>Escolha produtos no carrinho para continuar.</p><a class="botao botao--primario" href="carrinho.html">Ir para o carrinho</a></div>`);
  let finalizado = false;

  const estado = {
    endereco: Armazem.ler("endereco", { nome: "Nome", telefone: "(+00) 00 91234-5678", rua: "Rua não sei, 23", cidade: "São Paulo, São Paulo", cep: "12345678", cpf: "123.456.789-10" }),
    grupos: {
      nacional: { titulo: "Envio Nacional", itens: [], entrega: "padrao", cupom: null, mensagem: "" },
      internacional: { titulo: "Envio Internacional", itens: [], entrega: "padrao", cupom: null, mensagem: "" },
    },
    cupom: null,
    usarMoedas: false,
    metodo: null,
    parcelas: 1,
  };

  // Redistribui os itens nos grupos de envio; devolve false se não sobrou nada
  function distribuir() {
    const itens = itensAtuais();
    estado.grupos.nacional.itens = itens.filter((i) => produtoPorId(i.id).envio !== "internacional");
    estado.grupos.internacional.itens = itens.filter((i) => produtoPorId(i.id).envio === "internacional");
    pagina.classList.toggle("oculto", !itens.length);
    $("#pagamento-vazio").classList.toggle("oculto", !!itens.length);
    return itens.length > 0;
  }

  /* ---------- Endereço ---------- */
  function renderEndereco() {
    const e = estado.endereco;
    $("#endereco").innerHTML = `<p class="rotulo-laranja">Endereço De Entrega</p>
      <div class="endereco"><p><strong>${escapar(e.nome)} ${escapar(e.telefone)}</strong><br>${escapar(e.rua)}<br>${escapar(e.cidade)}, ${escapar(e.cep)}</p><button class="link-verde" id="trocar-endereco">Trocar</button></div>
      <div class="cpf"><strong>CPF</strong><span>${escapar(e.cpf)}</span></div>`;
    $("#trocar-endereco").addEventListener("click", editarEndereco);
  }
  function editarEndereco() {
    const e = estado.endereco;
    const campos = [["nome", "Nome completo"], ["telefone", "Telefone"], ["rua", "Rua e número"], ["cidade", "Cidade, Estado"], ["cep", "CEP"], ["cpf", "CPF"]];
    const modal = abrirModal({
      titulo: "Endereço de entrega",
      corpo: campos.map(([k, r]) => `<div class="campo"><label for="end-${k}">${r}</label><input id="end-${k}" value="${escapar(e[k])}" required></div>`).join("") + '<span class="campo-erro oculto" id="erro-end">Preencha todos os campos. CPF deve ter 11 números e CEP 8.</span>',
      acoes: `<button class="botao botao--contorno" data-fechar>Cancelar</button><button class="botao botao--primario" id="salvar-end">Salvar</button>`,
    });
    $("#salvar-end", modal).addEventListener("click", () => {
      const novo = {};
      campos.forEach(([k]) => (novo[k] = $("#end-" + k, modal).value.trim()));
      const cpfOk = novo.cpf.replace(/\D/g, "").length === 11;
      const cepOk = novo.cep.replace(/\D/g, "").length === 8;
      if (Object.values(novo).some((v) => !v) || !cpfOk || !cepOk) { $("#erro-end", modal).classList.remove("oculto"); return; }
      estado.endereco = novo; Armazem.salvar("endereco", novo);
      fecharModal(); renderEndereco(); toast("Endereço atualizado");
    });
  }

  /* ---------- Envios ---------- */
  const prazo = (dias1, dias2) => {
    const f = (d) => { const x = new Date(); x.setDate(x.getDate() + d); return x; };
    const a = f(dias1), b = f(dias2);
    const mes = b.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
    return `Chega entre ${a.getDate()} e ${b.getDate()}/${mes}`;
  };
  function calcularGrupo(g, chave) {
    const subtotal = g.itens.reduce((s, i) => s + produtoPorId(i.id).preco * i.qtd, 0);
    let frete = g.entrega === "expressa" ? FRETE_EXPRESSO : 0;
    let desconto = 0;
    if (g.cupom && CUPONS_LOJA[g.cupom].tipo === "pct") desconto = subtotal * CUPONS_LOJA[g.cupom].valor;
    if (g.cupom && CUPONS_LOJA[g.cupom].tipo === "frete") frete = 0;
    const imposto = chave === "internacional" ? subtotal * TAXA_IMPORTACAO : 0;
    const icms = chave === "internacional" ? (subtotal + imposto) * TAXA_ICMS : 0;
    return { subtotal, frete, desconto, imposto, icms, total: subtotal - desconto + frete };
  }

  function renderEnvios() {
    $("#envios").innerHTML = Object.entries(estado.grupos).filter(([, g]) => g.itens.length).map(([chave, g]) => {
      const c = calcularGrupo(g, chave);
      const [d1, d2] = chave === "internacional" ? (g.entrega === "expressa" ? [8, 12] : [15, 25]) : (g.entrega === "expressa" ? [1, 3] : [4, 9]);
      return `<section class="cartao cartao--pad envio-cartao" data-grupo="${chave}">
        <h3>${g.titulo}</h3>
        ${g.itens.map((i, idx) => {
          const p = produtoPorId(i.id);
          return `<div class="envio-item" data-idx="${idx}"><img src="${p.img}" alt=""><span class="envio-item__nome">${escapar(p.nome.length > 50 ? p.nome.slice(0, 50) + "…" : p.nome)}${i.variacao ? `<small>Variação: ${escapar(i.variacao)}</small>` : ""}</span>
            <div class="stepper"><button data-qtd="-1" aria-label="Diminuir">${icone("minus")}</button><input type="number" value="${i.qtd}" readonly aria-label="Quantidade"><button data-qtd="1" aria-label="Aumentar">${icone("plus")}</button></div>
            <span class="envio-item__preco">${moeda(p.preco * i.qtd)}</span></div>`;
        }).join("")}
        <div class="linha-pag"><span>Cupom da loja</span>${g.cupom ? `<span>${CUPONS_LOJA[g.cupom].nome} <button class="link-verde" data-remover-cupom>remover</button></span>` : '<button class="link-verde" data-cupom-loja>Selecione ou insira o código</button>'}</div>
        <label class="linha-pag"><span>Mensagem para o vendedor:</span><input data-mensagem placeholder="Digite aqui" value="${escapar(g.mensagem)}" maxlength="200"></label>
        <div class="entrega-opcao"><p class="rotulo-laranja">Opção de Entrega</p>
          <div class="entrega-opcao__linha"><p>${g.entrega === "expressa" ? `Entrega Expressa (${moeda(FRETE_EXPRESSO)})` : "Entrega Padrão (grátis)"}<br>${prazo(d1, d2)}</p><button class="link-verde" data-trocar-entrega>Trocar</button></div>
        </div>
        <div class="total-envio"><span>Total:</span><strong>${moeda(c.total)}</strong></div>
      </section>`;
    }).join("");
  }

  $("#envios").addEventListener("click", (e) => {
    const sec = e.target.closest("[data-grupo]"); if (!sec) return;
    const g = estado.grupos[sec.dataset.grupo];
    const btnQtd = e.target.closest("[data-qtd]");
    if (btnQtd) {
      const item = g.itens[Number(e.target.closest(".envio-item").dataset.idx)];
      const nova = item.qtd + Number(btnQtd.dataset.qtd);
      if (nova < 1 && itensTotais() === 1) return toast("O pedido precisa ter ao menos um item", "x");
      const mesmo = (x) => x.id === item.id && x.variacao === item.variacao;
      if (item.doCarrinho) {
        // Atualiza o próprio carrinho: tirar do pedido só desmarca o item (ele continua no carrinho)
        const carrinho = Carrinho.itens();
        const noCarrinho = carrinho.find(mesmo);
        if (noCarrinho) { if (nova < 1) noCarrinho.selecionado = false; else noCarrinho.qtd = Math.min(99, nova); }
        Carrinho.salvar(carrinho);
        if (nova < 1) toast("Item retirado do pedido (continua no carrinho)", "cart");
      } else {
        const ck = lerCheckout();
        const it = ck.itens.find(mesmo);
        if (nova < 1) ck.itens.splice(ck.itens.indexOf(it), 1); else it.qtd = Math.min(99, nova);
        Armazem.salvar("checkout", ck);
      }
      return; // o evento de sincronização redesenha a tela
    }
    if (e.target.closest("[data-trocar-entrega]")) { g.entrega = g.entrega === "padrao" ? "expressa" : "padrao"; atualizar(); }
    if (e.target.closest("[data-remover-cupom]")) { g.cupom = null; atualizar(); }
    if (e.target.closest("[data-cupom-loja]")) {
      const modal = abrirModal({
        titulo: "Cupom da loja",
        corpo: `<div class="campo"><label for="codigo">Código do cupom</label><input id="codigo" placeholder="Ex.: LOJA10" style="text-transform:uppercase"></div><span class="campo-erro oculto" id="erro-cod">Cupom inválido.</span><p style="font-size:.85rem;color:var(--texto-suave);margin-top:10px">Dica: experimente <strong>LOJA10</strong> ou <strong>FRETEGRATIS</strong>.</p>`,
        acoes: `<button class="botao botao--primario" id="aplicar-cod">Aplicar</button>`,
      });
      const aplicar = () => {
        const cod = $("#codigo", modal).value.trim().toUpperCase();
        if (!CUPONS_LOJA[cod]) return $("#erro-cod", modal).classList.remove("oculto");
        g.cupom = cod; fecharModal(); atualizar(); toast("Cupom aplicado: " + CUPONS_LOJA[cod].nome, "percent");
      };
      $("#aplicar-cod", modal).addEventListener("click", aplicar);
      $("#codigo", modal).addEventListener("keydown", (ev) => ev.key === "Enter" && aplicar());
    }
  });
  $("#envios").addEventListener("input", (e) => {
    if (e.target.matches("[data-mensagem]")) estado.grupos[e.target.closest("[data-grupo]").dataset.grupo].mensagem = e.target.value;
  });

  const itensTotais = () => Object.values(estado.grupos).reduce((s, g) => s + g.itens.length, 0);

  /* ---------- Cupom geral + moedas ---------- */
  $("#selecionar-cupom").addEventListener("click", () => {
    const resgatados = Armazem.ler("cupons_resgatados", []);
    const disponiveis = CUPONS.filter((c) => resgatados.includes(c.id));
    const subtotal = totais().subtotal;
    let escolhido = estado.cupom ? estado.cupom.id : null;
    const modal = abrirModal({
      titulo: "Selecione um cupom",
      corpo: disponiveis.length
        ? `<div role="radiogroup" aria-label="Seus cupons">${disponiveis.map((c) => {
            const ok = subtotal >= c.minimo;
            const sel = ok && escolhido === c.id;
            return `<div class="opcao-modal ${ok ? "" : "desabilitada"} ${sel ? "selecionada" : ""}" data-cupom="${ok ? c.id : ""}" role="radio" aria-checked="${sel}" aria-disabled="${!ok}" tabindex="${ok ? 0 : -1}"><span class="avatar" style="background:var(--primaria)">${icone("percent")}</span><div><strong>${moeda(c.desconto)} de desconto · ${c.marca}</strong><small>Compras acima de ${moeda(c.minimo)}${ok ? "" : " — faltam " + moeda(c.minimo - subtotal)}</small></div><span class="opcao-modal__check">${icone("check")}</span></div>`;
          }).join("")}</div>`
        : `<p>Você ainda não resgatou cupons.</p>`,
      acoes: disponiveis.length
        ? `<a class="botao botao--contorno" href="cupons.html">${icone("percent")} Pegar mais cupons</a><button class="botao botao--primario" id="confirmar-cupom" ${escolhido ? "" : "disabled"}>${icone("check")} Confirmar cupom</button>`
        : `<a class="botao botao--primario" href="cupons.html">${icone("percent")} Ver cupons</a>`,
    });
    $(".modal__acoes", modal)?.classList.add("modal__acoes--cupom");
    const confirmar = $("#confirmar-cupom", modal);
    const escolher = (el) => {
      if (!el.dataset.cupom) return toast("Valor mínimo não atingido", "x");
      escolhido = el.dataset.cupom;
      $$("[data-cupom]", modal).forEach((o) => {
        const sel = o === el;
        o.classList.toggle("selecionada", sel);
        o.setAttribute("aria-checked", String(sel));
      });
      if (confirmar) confirmar.disabled = false;
    };
    $$("[data-cupom]", modal).forEach((el) => {
      el.addEventListener("click", () => escolher(el));
      el.addEventListener("keydown", (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); escolher(el); } });
    });
    if (confirmar) confirmar.addEventListener("click", () => {
      if (!escolhido) return toast("Escolha um cupom primeiro", "x");
      estado.cupom = CUPONS.find((c) => c.id === escolhido);
      fecharModal(); atualizar(); toast("Cupom confirmado e aplicado", "percent");
    });
  });
  $("#cupom-aplicado").addEventListener("click", (e) => { if (e.target.closest("button")) { estado.cupom = null; atualizar(); } });
  $("#usar-moedas").addEventListener("change", (e) => { estado.usarMoedas = e.target.checked; atualizar(); });

  /* ---------- Métodos de pagamento ---------- */
  function renderMetodos(total) {
    const metodos = [
      { id: "pix", nome: "Pix" },
      { id: "cartao", nome: "Cartão de Crédito", extra: true },
      { id: "boleto", nome: "Boleto" },
    ];
    $("#metodos").innerHTML = metodos.map((m) => `<label class="metodo"><span>${m.nome}${m.extra ? (estado.metodo === "cartao"
        ? ` <select id="parcelas" aria-label="Parcelas">${Array.from({ length: 12 }, (_, i) => `<option value="${i + 1}" ${estado.parcelas === i + 1 ? "selected" : ""}>${i + 1}x de ${moeda(total / (i + 1))}${i < 6 ? " sem juros" : ""}</option>`).join("")}</select>`
        : ' <span class="link-verde" style="font-size:.9rem">Selecionar parcelas</span>') : ""}</span>
      <input type="radio" name="metodo" class="check" value="${m.id}" ${estado.metodo === m.id ? "checked" : ""}></label>`).join("");
  }
  $("#metodos").addEventListener("change", (e) => {
    if (e.target.name === "metodo") { estado.metodo = e.target.value; atualizar(); }
    if (e.target.id === "parcelas") estado.parcelas = Number(e.target.value);
  });

  /* ---------- Resumo ---------- */
  function totais() {
    const r = { subtotal: 0, frete: 0, desconto: 0, imposto: 0, icms: 0 };
    Object.entries(estado.grupos).forEach(([chave, g]) => {
      if (!g.itens.length) return;
      const c = calcularGrupo(g, chave);
      r.subtotal += c.subtotal; r.frete += c.frete; r.desconto += c.desconto; r.imposto += c.imposto; r.icms += c.icms;
    });
    r.cupom = estado.cupom && r.subtotal >= estado.cupom.minimo ? estado.cupom.desconto : 0;
    const base = r.subtotal - r.desconto - r.cupom;
    r.moedasDisponivel = Math.min(Moedas.saldo() / 100, Math.max(0, base) * LIMITE_MOEDAS);
    r.moedas = estado.usarMoedas ? r.moedasDisponivel : 0;
    r.total = Math.max(0, base + r.frete + r.imposto + r.icms - r.moedas);
    return r;
  }

  function atualizar() {
    if (estado.cupom && !Armazem.ler("cupons_resgatados", []).includes(estado.cupom.id)) estado.cupom = null; // usado em outra aba
    renderEnvios();
    const t = totais();
    if (estado.cupom && !t.cupom) { estado.cupom = null; toast("Cupom removido: valor mínimo não atingido", "x"); }
    $("#cupom-aplicado").innerHTML = estado.cupom ? `<div class="cupom-aplicado"><span>${moeda(estado.cupom.desconto)} OFF · ${estado.cupom.marca}</span><button class="link-verde">remover</button></div>` : "";
    $("#selecionar-cupom").textContent = estado.cupom ? "Trocar cupom" : "Selecione Cupom";
    $("#saldo-moedas").textContent = Moedas.saldo().toLocaleString("pt-BR");
    $("#valor-moedas").textContent = `[-${moeda(t.moedasDisponivel)}]`;
    $("#resumo").innerHTML = `
      <dt>Total dos Produtos</dt><dd>${moeda(t.subtotal)}</dd>
      <dt>Total de Imposto de Importação</dt><dd>${moeda(t.imposto)}</dd>
      <dt>Total de ICMS</dt><dd>${moeda(t.icms)}</dd>
      <dt>Total do Frete</dt><dd>${t.frete ? moeda(t.frete) : "Grátis"}</dd>
      ${t.desconto ? `<dt class="desconto">Cupom da loja</dt><dd class="desconto">-${moeda(t.desconto)}</dd>` : ""}
      ${t.cupom ? `<dt class="desconto">Cupom Shopee</dt><dd class="desconto">-${moeda(t.cupom)}</dd>` : ""}
      ${t.moedas ? `<dt class="desconto">Moedas Shopee</dt><dd class="desconto">-${moeda(t.moedas)}</dd>` : ""}`;
    $("#pagamento-total").textContent = moeda(t.total);
    renderMetodos(t.total);
  }

  /* ---------- Fazer pedido ---------- */
  $("#fazer-pedido").addEventListener("click", () => {
    if (!estado.metodo) { toast("Escolha um método de pagamento", "x"); $("#metodos").scrollIntoView({ behavior: "smooth", block: "center" }); return; }
    finalizado = true; // a partir daqui a tela não se redesenha mais
    const t = totais();
    const todos = [...estado.grupos.nacional.itens, ...estado.grupos.internacional.itens];
    const porLoja = {};
    todos.forEach((i) => { const l = produtoPorId(i.id).loja; (porLoja[l] = porLoja[l] || []).push({ id: i.id, qtd: i.qtd, variacao: i.variacao }); });
    const status = estado.metodo === "boleto" ? "a-pagar" : "preparando";
    const pedidos = Armazem.ler("pedidos", null) || PEDIDOS_PADRAO;
    Object.entries(porLoja).reverse().forEach(([loja, its]) => pedidos.unshift({ id: "p" + Date.now() + loja, loja, status, itens: its, metodo: estado.metodo }));
    Armazem.salvar("pedidos", pedidos);

    // Tira do carrinho o que foi comprado
    const comprados = todos.filter((i) => i.doCarrinho);
    if (comprados.length) Carrinho.salvar(Carrinho.itens().filter((c) => !comprados.some((i) => i.id === c.id && i.variacao === c.variacao)));
    if (t.moedas) Moedas.somar(-Math.round(t.moedas * 100));
    if (estado.cupom) Armazem.salvar("cupons_resgatados", Armazem.ler("cupons_resgatados", []).filter((id) => id !== estado.cupom.id));
    Armazem.salvar("checkout", { origem: "carrinho" });
    Notificacoes.adicionar({ titulo: "Pedido realizado!", texto: `Seu pedido de ${moeda(t.total)} foi recebido. ${status === "a-pagar" ? "Pague o boleto para o envio." : "O vendedor já está preparando."}`, link: "minhas-compras.html", icone: "bag" });

    const modal = abrirModal({
      titulo: "Pedido realizado! 🎉",
      corpo: `<p>Total pago: <strong class="preco">${moeda(t.total)}</strong></p><p>Forma de pagamento: ${{ pix: "Pix", cartao: `Cartão de Crédito em ${estado.parcelas}x`, boleto: "Boleto" }[estado.metodo]}</p>${estado.metodo === "pix" ? '<p style="background:var(--pessego-claro);padding:12px;border-radius:8px;font-family:monospace;word-break:break-all">00020126580014BR.GOV.BCB.PIX0136shopee-demo-pix52040000</p>' : ""}`,
      acoes: `<a class="botao botao--primario" href="minhas-compras.html">Ver meus pedidos</a>`,
    });
    const fundo = $(".modal-fundo");
    fundo.addEventListener("click", (e) => { if (e.target === fundo || e.target.closest("[data-fechar]")) location.href = "minhas-compras.html"; });
  });

  /* ---------- Sincronização ---------- */
  aoMudar(["carrinho", "checkout"], () => { if (!finalizado && distribuir()) atualizar(); });
  aoMudar(["moedas", "cupons_resgatados"], () => { if (!finalizado) atualizar(); });
  aoMudar(["endereco"], () => { estado.endereco = Armazem.ler("endereco", estado.endereco); renderEndereco(); });

  renderEndereco();
  if (distribuir()) atualizar();
});
