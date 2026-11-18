/* =========================================================
   PRODUTO — galeria, variações, quantidade, carrinho,
   descrição, avaliações e informações da loja
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const produto = produtoPorId(param("id")) || PRODUTOS[0];
  const loja = lojaPorId(produto.loja);
  const galeria = produto.galeria || [produto.img, produto.img, produto.img, produto.img];
  const escolha = { cor: null, tamanho: null, qtd: 1, imagem: 0 };
  const ESTOQUE = 99;

  document.title = `${produto.nome} | Shopee`;

  /* ---------- Galeria ---------- */
  const imgPrincipal = $("#imagem-principal");
  const miniaturas = $("#miniaturas");
  miniaturas.innerHTML = galeria.map((src, i) => `<button aria-label="Imagem ${i + 1}" class="${i === 0 ? "ativo" : ""}"><img src="${src}" alt=""></button>`).join("");
  function mostrarImagem(i) {
    escolha.imagem = (i + galeria.length) % galeria.length;
    imgPrincipal.src = galeria[escolha.imagem];
    imgPrincipal.alt = produto.nome;
    $$("button", miniaturas).forEach((b, j) => b.classList.toggle("ativo", j === escolha.imagem));
    const ativo = $$("button", miniaturas)[escolha.imagem];
    miniaturas.scrollTo({ left: ativo.offsetLeft - miniaturas.offsetLeft - 20 });
  }
  $$("button", miniaturas).forEach((b, i) => { b.addEventListener("click", () => mostrarImagem(i)); b.addEventListener("mouseenter", () => mostrarImagem(i)); });
  $$("[data-galeria]").forEach((b) => { b.innerHTML = icone(b.dataset.galeria === "1" ? "right" : "left"); b.addEventListener("click", () => mostrarImagem(escolha.imagem + Number(b.dataset.galeria))); });
  mostrarImagem(0);

  /* ---------- Informações e variações ---------- */
  const info = $("#produto-info");
  const pct = descontoPct(produto);
  info.innerHTML = `
    <h1 class="produto-info__nome">${escapar(produto.nome)}</h1>
    ${botaoFav(produto.id)}
    ${loja.oficial ? '<span class="selo-oficial">Loja Oficial</span>' : ""}
    <div class="nota">${notaBR(produto.nota).replace(",", ".")} ${estrelasHTML(produto.nota)}</div>
    <div class="produto-info__preco">${moeda(produto.preco).replace(" ", "")}${produto.precoDe ? `<small>De <span class="riscado">${moeda(produto.precoDe)}</span></small>` : ""}</div>
    ${produto.cores ? `<h4>Cor:</h4><div class="chips" data-grupo="cor">${produto.cores.map((c) => c.img
        ? `<button class="chip chip--img" data-valor="${c.nome}" data-img="${c.img}"><img src="${c.img}" alt="">${c.nome}</button>`
        : `<button class="chip" data-valor="${c.nome}">${c.nome}</button>`).join("")}</div>` : ""}
    ${produto.tamanhos ? `<h4>Tamanho:</h4><div class="chips" data-grupo="tamanho">${produto.tamanhos.map((t) => `<button class="chip" data-valor="${t}">${t}</button>`).join("")}</div>` : ""}
    ${pct ? `<div class="economize">ECONOMIZE ${pct}%</div>` : ""}`;

  $$(".chips", info).forEach((grupo) => {
    grupo.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      const nome = grupo.dataset.grupo;
      const jaAtivo = chip.classList.contains("ativo");
      $$(".chip", grupo).forEach((c) => c.classList.remove("ativo"));
      if (!jaAtivo) chip.classList.add("ativo");
      escolha[nome] = jaAtivo ? null : chip.dataset.valor;
      if (chip.dataset.img && !jaAtivo) {
        const i = galeria.indexOf(chip.dataset.img);
        if (i >= 0) mostrarImagem(i); else imgPrincipal.src = chip.dataset.img;
      }
    });
  });

  /* ---------- Lateral de compra ---------- */
  const entrega = new Date(); entrega.setDate(entrega.getDate() + (produto.envio === "internacional" ? 18 : 6));
  const dataEntrega = entrega.toLocaleDateString("pt-BR", { day: "numeric", month: "short" }).replace(".", "").replace(" de ", "/");
  $("#lateral-compra").innerHTML = `
    <h4>Enviado de:</h4>
    <div class="envio">
      ${icone(produto.envio === "internacional" ? "plane" : "truck")}
      <p><strong>Receba até ${dataEntrega}</strong></p>
      <p><span class="fraco">Enviado de:</span> <strong>${produto.local}</strong></p>
      <p class="fraco">Frete</p>
      <p><strong>Frete grátis</strong> com cupom</p>
    </div>
    <h4 style="margin-top:20px">Quantidade:</h4>
    <div class="stepper">
      <button type="button" data-qtd="-1" aria-label="Diminuir">${icone("minus")}</button>
      <input type="number" id="quantidade" value="1" min="1" max="${ESTOQUE}" aria-label="Quantidade">
      <button type="button" data-qtd="1" aria-label="Aumentar">${icone("plus")}</button>
    </div>
    <p class="estoque">${ESTOQUE} disponíveis</p>
    <button class="botao botao--pessego" id="adicionar">Adicionar ao Carrinho</button>
    <button class="botao botao--primario" id="comprar">Comprar Agora</button>`;

  const campoQtd = $("#quantidade");
  const ajustarQtd = (v) => { escolha.qtd = Math.min(ESTOQUE, Math.max(1, Number(v) || 1)); campoQtd.value = escolha.qtd; };
  $$("[data-qtd]").forEach((b) => b.addEventListener("click", () => ajustarQtd(escolha.qtd + Number(b.dataset.qtd))));
  campoQtd.addEventListener("change", () => ajustarQtd(campoQtd.value));

  function variacaoEscolhida() {
    if (produto.cores && !escolha.cor) { toast("Selecione uma cor", "x"); destacar('[data-grupo="cor"]'); return null; }
    if (produto.tamanhos && !escolha.tamanho) { toast("Selecione um tamanho", "x"); destacar('[data-grupo="tamanho"]'); return null; }
    return [escolha.cor, escolha.tamanho].filter(Boolean).join(", ");
  }
  function destacar(sel) {
    const el = $(sel);
    el.animate([{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }], { duration: 300 });
  }
  $("#adicionar").addEventListener("click", () => {
    const variacao = variacaoEscolhida();
    if (variacao === null) return;
    Carrinho.adicionar(produto.id, escolha.qtd, variacao);
    toast(`${escolha.qtd} item(ns) adicionado(s) ao carrinho`, "cart");
  });
  $("#comprar").addEventListener("click", () => {
    const variacao = variacaoEscolhida();
    if (variacao === null) return;
    Armazem.salvar("checkout", { origem: "agora", itens: [{ id: produto.id, qtd: escolha.qtd, variacao }] });
    location.href = "pagamento.html";
  });

  /* ---------- Descrição (acordeão) ---------- */
  $("#texto-descricao").textContent = produto.descricao || "Sem descrição.";
  const acordeao = $("#descricao");
  $(".acordeao__botao", acordeao).addEventListener("click", (e) => {
    const aberto = acordeao.classList.toggle("aberto");
    e.currentTarget.setAttribute("aria-expanded", aberto);
  });

  /* ---------- Avaliações (cartão + popup com todas) ---------- */
  const caixaAval = $("#avaliacoes");
  const avaliacaoHTML = (a) => `<div class="avaliacao">
      <span class="avatar"></span>
      <div><h5>${escapar(a.usuario)}</h5>${estrelasHTML(a.nota, "estrelas--vermelhas")}<p>${escapar(a.texto)}</p><div class="avaliacao__foto">
  ${(a.fotos || []).map(foto => `
    <img src="${foto}" alt="Foto da avaliação">
  `).join("")}
</div></div></div>
    </div>`;
  // Avaliar só aparece para quem já comprou o produto
  const botaoAvaliar = (texto, extra = "") => comprouProduto(produto.id)
    ? `<button class="botao botao--primario ${extra}" data-avaliar>${icone("star")} ${texto}</button>`
    : `<p class="avaliar-bloqueado ${extra}">${icone("bag")} Compre este produto para poder avaliar</p>`;
  function renderAvaliacoes() {
    const avaliacoes = avaliacoesDoProduto(produto);
    caixaAval.innerHTML = `
      <button class="avaliacoes__topo" id="ver-avaliacoes" aria-haspopup="dialog">
        <span class="avaliacoes__nota">${notaBR(produto.nota).replace(",", ".")}</span>
        <h3>Avaliações do Produto <small style="font-weight:300">(${avaliacoes.length})</small></h3>${icone("right")}
      </button>
      ${avaliacoes.slice(0, 2).map(avaliacaoHTML).join("") || '<p class="vazio">Este produto ainda não tem avaliações.</p>'}
      <div class="avaliacoes__acoes">
        <button class="botao botao--contorno" data-ver-todas>Ver todas (${avaliacoes.length})</button>
        ${botaoAvaliar("Avaliar produto")}
      </div>`;
  }
  function abrirTodasAvaliacoes(filtroNota = 0) {
    const avaliacoes = avaliacoesDoProduto(produto);
    const filtradas = avaliacoes.filter((a) => !filtroNota || a.nota === filtroNota);
    const modal = abrirModal({
      titulo: `Avaliações (${avaliacoes.length})`,
      corpo: `<div class="avaliacoes-pop__resumo"><span class="avaliacoes__nota">${notaBR(produto.nota).replace(",", ".")}</span><div>${estrelasHTML(produto.nota, "estrelas--vermelhas")}<small>${avaliacoes.length} avaliação(ões)</small></div></div>
        <div class="filtro-notas">${[0, 5, 4, 3, 2, 1].map((n) => `<button class="chip ${filtroNota === n ? "ativo" : ""}" data-nota="${n}">${n ? n + " ★" : "Todas"}</button>`).join("")}</div>
        <div class="avaliacoes-pop__lista">${filtradas.map(avaliacaoHTML).join("") || '<p class="vazio">Nenhuma avaliação com essa nota.</p>'}</div>`,
      acoes: botaoAvaliar("Escrever avaliação", "botao--bloco"),
    });
    modal.classList.add("modal--largo");
    $$("[data-nota]", modal).forEach((b) => b.addEventListener("click", () => abrirTodasAvaliacoes(Number(b.dataset.nota))));
    $("[data-avaliar]", modal)?.addEventListener("click", avaliar);
  }
  const avaliar = () => abrirFormAvaliacao(produto.id, renderAvaliacoes);
  caixaAval.addEventListener("click", (e) => {
    if (e.target.closest("#ver-avaliacoes, [data-ver-todas]")) abrirTodasAvaliacoes();
    if (e.target.closest("[data-avaliar]")) avaliar();
  });
  aoMudar(["avaliacoes_" + produto.id, "pedidos"], renderAvaliacoes);
  renderAvaliacoes();
  if (param("avaliar")) avaliar();

  /* ---------- Loja ---------- */
  $("#loja-cartao").innerHTML = `
    <div class="loja-cartao__topo"><span class="avatar">${iniciais(loja.nome)}</span><div><strong>${loja.nome}</strong><div class="status-online">Online</div></div></div>
    <dl>
      <dt>Avaliações</dt><dd>${loja.avaliacoes}</dd>
      <dt>Taxa de resposta do chat</dt><dd>${loja.taxa}</dd>
      <dt>Loja Shopee desde</dt><dd>${loja.desde}</dd>
      <dt>produtos</dt><dd>${loja.produtos}</dd>
      <dt>Geralmente responde o chat em</dt><dd>${loja.responde}</dd>
      <dt>Seguidores</dt><dd>${loja.seguidores}</dd>
    </dl>
    <a class="botao botao--primario" href="chat.html?loja=${loja.id}&produto=${produto.id}" style="margin-top:12px">Conversar Agora</a>`;
});
