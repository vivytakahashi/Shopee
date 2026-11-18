/* =========================================================
   FAVORITOS — lista, remover, similares e carrinho
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const grade = $("#favoritos");

  function render() {
    const produtos = Favoritos.lista().map(produtoPorId).filter(Boolean);
    if (!produtos.length) {
      grade.style.display = "block";
      grade.innerHTML = `<div class="cartao vazio">${icone("heart")}<h3>Nenhum favorito ainda</h3><p>Toque no coração dos produtos para salvá-los aqui.</p><a class="botao botao--primario" href="index.html">Explorar produtos</a></div>`;
      return;
    }
    grade.style.display = "";
    grade.innerHTML = produtos.map((p) => `<article class="cartao fav-card">
      <a class="fav-card__img" href="produto.html?id=${p.id}"><img src="${p.img}" alt="${escapar(p.nome)}" loading="lazy"></a>
      <div class="fav-card__info">
        <a class="fav-card__nome" href="produto.html?id=${p.id}" title="${escapar(p.nome)}">${escapar(p.nome)}</a>
        <span class="fav-card__preco">${moeda(p.preco).replace(" ", "")}</span>
        <span class="fav-card__vendidos">${p.vendidos} Vendido(s)</span>
        <div class="fav-card__acoes">
          <button class="fav-card__mais" data-menu="${p.id}" aria-label="Mais opções">${icone("dots")}</button>
          <a class="botao-similares" href="categorias.html?cat=${p.categoria}">Similares</a>
          <button class="botao-carrinho" data-carrinho="${p.id}" aria-label="Adicionar ao carrinho">${icone("cart")}</button>
        </div>
      </div>
    </article>`).join("");
  }

  grade.addEventListener("click", (e) => {
    const menu = e.target.closest("[data-menu]");
    if (menu) {
      const aberto = $(".menu-pop", menu.parentElement);
      $$(".menu-pop").forEach((m) => m.remove());
      if (aberto) return;
      const id = menu.dataset.menu;
      menu.parentElement.insertAdjacentHTML("beforeend", `<div class="menu-pop"><button data-remover="${id}">${icone("trash")} Remover dos favoritos</button><a href="produto.html?id=${id}">${icone("bag")} Ver produto</a><a href="chat.html?loja=${produtoPorId(id).loja}&produto=${id}">${icone("message")} Falar com a loja</a></div>`);
      return;
    }
    const rem = e.target.closest("[data-remover]");
    if (rem) { Favoritos.alternar(rem.dataset.remover); return; }
    const car = e.target.closest("[data-carrinho]");
    if (car) {
      const p = produtoPorId(car.dataset.carrinho);
      if (variacoesDe(p).length) { location.href = `produto.html?id=${p.id}`; return; }
      Carrinho.adicionar(p.id, 1, ""); toast("Adicionado ao carrinho", "cart");
    }
  });
  document.addEventListener("click", (e) => { if (!e.target.closest(".fav-card__acoes")) $$(".menu-pop").forEach((m) => m.remove()); });
  aoMudar(["favoritos"], render);

  render();
});
