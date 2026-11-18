/* =========================================================
   CATEGORIAS — filtro por categoria, busca e ordenação
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  let categoria = param("cat");
  const busca = param("q") || "";
  const nav = $("#categorias");
  const resultados = $("#resultados");
  const ordenar = $("#ordenar");

  nav.innerHTML = CATEGORIAS.map((c) => `<a class="categoria" href="?cat=${c.id}" data-cat="${c.id}"><span class="categoria__icone">${icone(c.icone)}</span>${c.nome}</a>`).join("");

  function filtrar() {
    let lista = PRODUTOS.slice();
    if (busca) lista = lista.filter((p) => normalizar(p.nome).includes(normalizar(busca)));
    if (categoria === "internacional") lista = lista.filter((p) => p.envio === "internacional");
    else if (categoria === "oficiais") lista = lista.filter((p) => lojaPorId(p.loja).oficial);
    else if (categoria === "frete") lista = lista.filter((p) => p.envio === "nacional");
    else if (categoria) lista = lista.filter((p) => p.categoria === categoria);
    const ord = ordenar.value;
    if (ord === "menor") lista.sort((a, b) => a.preco - b.preco);
    if (ord === "maior") lista.sort((a, b) => b.preco - a.preco);
    if (ord === "nota") lista.sort((a, b) => b.nota - a.nota);
    if (ord === "desconto") lista.sort((a, b) => descontoPct(b) - descontoPct(a));
    return lista;
  }

  function render() {
    $$(".categoria", nav).forEach((a) => a.classList.toggle("ativo", a.dataset.cat === categoria));
    const cat = CATEGORIAS.find((c) => c.id === categoria);
    const titulo = busca ? `Resultados para "${escapar(busca)}"` : cat ? cat.nome : "Todos os produtos";
    const lista = filtrar();
    $("#titulo-resultados").innerHTML = `${titulo} <small style="color:var(--texto-suave);font-weight:400">(${lista.length})</small>${categoria || busca ? '<a class="limpar-filtro" href="categorias.html">limpar filtro</a>' : ""}`;
    resultados.innerHTML = lista.length ? lista.map((p) => produtoLinhaHTML(p)).join("")
      : `<div class="vazio" style="grid-column:1/-1">${icone("search")}<h3>Nenhum produto encontrado</h3><p>Tente outra categoria ou palavra.</p></div>`;
  }

  nav.addEventListener("click", (e) => {
    const a = e.target.closest("[data-cat]");
    if (!a) return;
    e.preventDefault();
    categoria = categoria === a.dataset.cat ? null : a.dataset.cat;
    const url = new URLSearchParams();
    if (categoria) url.set("cat", categoria);
    if (busca) url.set("q", busca);
    history.replaceState(null, "", url.toString() ? "?" + url : "categorias.html");
    render();
  });
  ordenar.addEventListener("change", render);
  render();
});
