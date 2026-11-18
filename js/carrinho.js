/* =========================================================
   CARRINHO — agrupado por loja, seleção, quantidade,
   variação, exclusão e total
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const lista = $("#lista-carrinho");
  const selTudo = [$("#selecionar-tudo"), $("#selecionar-tudo-2")];

  function render() {
    const itens = Carrinho.itens();
    const resumo = $("#resumo-carrinho");
    const cabecalho = $(".carrinho-cabecalho");
    if (!itens.length) {
      lista.innerHTML = `<div class="cartao vazio">${icone("cart")}<h3>Seu carrinho está vazio</h3><p>Que tal dar uma olhada nas ofertas de hoje?</p><a class="botao botao--primario" href="index.html">Ir às compras</a></div>`;
      resumo.classList.add("oculto"); cabecalho.classList.add("oculto");
      return;
    }
    resumo.classList.remove("oculto"); cabecalho.classList.remove("oculto");

    // Agrupa por loja mantendo a ordem
    const grupos = {};
    itens.forEach((item, indice) => {
      const p = produtoPorId(item.id);
      if (!p) return;
      (grupos[p.loja] = grupos[p.loja] || []).push({ ...item, indice, produto: p });
    });

    lista.innerHTML = Object.entries(grupos).map(([lojaId, itensLoja]) => {
      const loja = lojaPorId(lojaId);
      const todosSel = itensLoja.every((i) => i.selecionado);
      return `<section class="cartao loja-grupo">
        <div class="loja-grupo__topo"><input type="checkbox" class="check" data-loja="${lojaId}" ${todosSel ? "checked" : ""} aria-label="Selecionar ${loja.nome}"><a href="chat.html?loja=${lojaId}">${loja.nome}</a>${loja.oficial ? '<span class="selo-oficial">Oficial</span>' : ""}</div>
        ${itensLoja.map((i) => {
          const opcoes = variacoesDe(i.produto);
          return `<div class="carrinho-item" data-indice="${i.indice}">
            <input type="checkbox" class="check" data-selecionar ${i.selecionado ? "checked" : ""} aria-label="Selecionar item">
            <div class="carrinho-item__produto"><img src="${i.produto.img}" alt=""><a href="produto.html?id=${i.produto.id}">${escapar(i.produto.nome.length > 40 ? i.produto.nome.slice(0, 40) + "…" : i.produto.nome)}</a></div>
            <div class="carrinho-item__var">${opcoes.length ? `<select class="variacao-select" data-variacao aria-label="Variação">${opcoes.map((o) => `<option ${o === i.variacao ? "selected" : ""}>${o}</option>`).join("")}</select>` : '<span style="color:var(--texto-fraco)">Única</span>'}</div>
            <span class="carrinho-item__unit">${moeda(i.produto.preco)}</span>
            <div class="stepper"><button data-qtd="-1" aria-label="Diminuir">${icone("minus")}</button><input type="number" value="${i.qtd}" min="1" max="99" data-qtd-campo aria-label="Quantidade"><button data-qtd="1" aria-label="Aumentar">${icone("plus")}</button></div>
            <span class="carrinho-item__total">${moeda(i.produto.preco * i.qtd)}</span>
            <button class="botao-excluir" data-excluir>Excluir</button>
          </div>`;
        }).join("")}
      </section>`;
    }).join("");

    // Totais
    const selecionados = itens.filter((i) => i.selecionado);
    const total = selecionados.reduce((s, i) => s + produtoPorId(i.id).preco * i.qtd, 0);
    $("#qtd-selecionada").textContent = selecionados.reduce((s, i) => s + i.qtd, 0);
    $("#total-carrinho").textContent = moeda(total);
    selTudo.forEach((c) => (c.checked = itens.every((i) => i.selecionado)));
    $("#continuar").disabled = !selecionados.length;
  }

  function alterar(indice, fn) {
    const itens = Carrinho.itens();
    fn(itens[indice], itens);
    Carrinho.salvar(itens);
    render();
  }

  lista.addEventListener("click", (e) => {
    const linha = e.target.closest(".carrinho-item");
    const btnQtd = e.target.closest("[data-qtd]");
    if (linha && btnQtd) {
      const delta = Number(btnQtd.dataset.qtd);
      const indice = Number(linha.dataset.indice);
      const item = Carrinho.itens()[indice];
      if (item.qtd + delta < 1) return confirmarExclusao([indice]);
      alterar(indice, (it) => (it.qtd = Math.min(99, it.qtd + delta)));
    }
    if (linha && e.target.closest("[data-excluir]")) confirmarExclusao([Number(linha.dataset.indice)]);
  });

  lista.addEventListener("change", (e) => {
    const linha = e.target.closest(".carrinho-item");
    if (e.target.matches("[data-selecionar]")) alterar(Number(linha.dataset.indice), (it) => (it.selecionado = e.target.checked));
    if (e.target.matches("[data-qtd-campo]")) alterar(Number(linha.dataset.indice), (it) => (it.qtd = Math.min(99, Math.max(1, Number(e.target.value) || 1))));
    if (e.target.matches("[data-variacao]")) {
      alterar(Number(linha.dataset.indice), (it, itens) => {
        const duplicado = itens.find((o) => o !== it && o.id === it.id && o.variacao === e.target.value);
        if (duplicado) { duplicado.qtd = Math.min(99, duplicado.qtd + it.qtd); itens.splice(itens.indexOf(it), 1); toast("Itens iguais foram unidos"); }
        else it.variacao = e.target.value;
      });
    }
    if (e.target.matches("[data-loja]")) {
      const itens = Carrinho.itens();
      itens.forEach((i) => { if (produtoPorId(i.id).loja === e.target.dataset.loja) i.selecionado = e.target.checked; });
      Carrinho.salvar(itens); render();
    }
  });

  selTudo.forEach((c) => c.addEventListener("change", () => {
    const itens = Carrinho.itens();
    itens.forEach((i) => (i.selecionado = c.checked));
    Carrinho.salvar(itens); render();
  }));

  function confirmarExclusao(indices) {
    const modal = abrirModal({
      titulo: "Remover do carrinho",
      corpo: `<p>Deseja remover ${indices.length > 1 ? indices.length + " itens" : "este item"} do carrinho?</p>`,
      acoes: `<button class="botao botao--contorno" data-fechar>Não</button><button class="botao botao--primario" id="confirmar">Sim, remover</button>`,
    });
    $("#confirmar", modal).addEventListener("click", () => {
      const itens = Carrinho.itens().filter((_, i) => !indices.includes(i));
      Carrinho.salvar(itens); fecharModal(); render(); toast("Item removido", "trash");
    });
  }

  $("#excluir-selecionados").addEventListener("click", () => {
    const indices = Carrinho.itens().map((i, idx) => (i.selecionado ? idx : -1)).filter((i) => i >= 0);
    if (!indices.length) return toast("Selecione ao menos um item", "x");
    confirmarExclusao(indices);
  });

  $("#continuar").addEventListener("click", () => {
    const selecionados = Carrinho.itens().filter((i) => i.selecionado).map(({ id, qtd, variacao }) => ({ id, qtd, variacao, doCarrinho: true }));
    if (!selecionados.length) return toast("Selecione ao menos um item", "x");
    // O pagamento lê os itens selecionados direto do carrinho (sempre sincronizado)
    Armazem.salvar("checkout", { origem: "carrinho" });
    location.href = "pagamento.html";
  });

  aoMudar(["carrinho"], render);
  render();
});
