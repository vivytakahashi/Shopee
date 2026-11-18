/* =========================================================
   HOME — carrossel, atalhos, ofertas relâmpago, recomendados
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Carrossel de banners ---------- */
  const slides = [
    { classe: "", img: "img/banner-1.jpg", titulo: "Ofertas de até 70%", texto: "Os melhores preços em milhares de produtos", link: "oferta-relampago.html" },
    { anuncio: "img/Anuncio1.webp", titulo: "Lojas Oficiais: sua casa de cara nova", link: "categorias.html?cat=oficiais" },
    { anuncio: "img/Anuncio2.webp", titulo: "Resgate cupons de até R$15 OFF", link: "cupons.html" },
    { anuncio: "img/Anuncio3.webp", titulo: "Tudo para o seu bebê", link: "categorias.html?cat=bebe" },
    { anuncio: "img/Anuncio4.webp", titulo: "Black Friday: 1 ano de Shopee grátis", link: "oferta-relampago.html" },
    { anuncio: "img/Anuncio5.webp", titulo: "Frete grátis na sua 1ª compra", link: "categorias.html?cat=frete" },
  ];
  const trilho = $("#carrossel .carrossel__trilho");
  const pontos = $("#pontos");
  trilho.innerHTML = slides.map((s, i) => s.anuncio
    ? `<a class="slide slide--anuncio" href="${s.link}" aria-label="${s.titulo}" ${i ? 'tabindex="-1"' : ""}>
      <img class="slide__fundo" src="${s.anuncio}" alt=""><img class="slide__frente" src="${s.anuncio}" alt="${s.titulo}"></a>`
    : `<a class="slide ${s.classe}" href="${s.link}" aria-label="${s.titulo}" ${i ? 'tabindex="-1"' : ""}>
      ${s.img ? `<img src="${s.img}" alt="">` : ""}<h2>${s.titulo}</h2><p>${s.texto}</p></a>`).join("");
  pontos.innerHTML = slides.map((s, i) => `<button role="tab" aria-label="Banner ${i + 1}" class="${i === 0 ? "ativo" : ""}"></button>`).join("");
  $(".carrossel__seta--esq").innerHTML = icone("left");
  $(".carrossel__seta--dir").innerHTML = icone("right");

  let atual = 0;
  let timer;
  function irPara(i) {
    atual = (i + slides.length) % slides.length;
    trilho.style.transform = `translateX(-${atual * 100}%)`;
    $$("button", pontos).forEach((b, j) => b.classList.toggle("ativo", j === atual));
    $$(".slide", trilho).forEach((s, j) => s.setAttribute("tabindex", j === atual ? "0" : "-1"));
    reiniciar();
  }
  function reiniciar() { clearInterval(timer); timer = setInterval(() => irPara(atual + 1), 5000); }
  $$("button", pontos).forEach((b, i) => b.addEventListener("click", () => irPara(i)));
  $(".carrossel__seta--esq").addEventListener("click", () => irPara(atual - 1));
  $(".carrossel__seta--dir").addEventListener("click", () => irPara(atual + 1));
  // Arrastar no celular
  let inicioX = null;
  trilho.addEventListener("touchstart", (e) => (inicioX = e.touches[0].clientX), { passive: true });
  trilho.addEventListener("touchend", (e) => {
    if (inicioX === null) return;
    const dx = e.changedTouches[0].clientX - inicioX;
    if (Math.abs(dx) > 40) irPara(atual + (dx < 0 ? 1 : -1));
    inicioX = null;
  });
  reiniciar();

  /* ---------- Atalhos ---------- */
  const atalhos = [
    { nome: "Cupom", icone: "percent", link: "cupons.html" },
    { nome: "Frete grátis", icone: "truck", link: "categorias.html?cat=frete" },
    { nome: "Moedas", icone: "dollar", link: "moedas.html" },
    { nome: "Internacional", icone: "plane", link: "categorias.html?cat=internacional" },
    { nome: "Lojas Oficiais", icone: "bagcheck", link: "categorias.html?cat=oficiais" },
    { nome: "Mais Categorias", icone: "grid", link: "categorias.html" },
  ];
  $("#atalhos").innerHTML = atalhos.map((a) => `<a class="atalho" href="${a.link}"><span class="atalho__circulo">${icone(a.icone)}</span>${a.nome}</a>`).join("");

  /* ---------- Ofertas relâmpago ---------- */
  const faixa = $("#faixa-relampago");
  // Destaques do layout primeiro, depois os demais em ordem de desconto
  const destaques = ["cabeceira", "fone", "comoda", "tenis"];
  const ofertas = [
    ...destaques.map(produtoPorId),
    ...PRODUTOS.filter((p) => p.relampago && !destaques.includes(p.id)).sort((a, b) => descontoPct(b) - descontoPct(a)),
  ];
  faixa.innerHTML = ofertas.map((p) => `<a class="oferta" href="produto.html?id=${p.id}">
      <div class="oferta__img"><img src="${p.img}" alt="${escapar(p.nome)}" loading="lazy"></div>
      ${botaoFav(p.id)}
      <span class="oferta__desconto">-${descontoPct(p)}%</span>
      <div class="oferta__preco">${moeda(p.preco)}</div>
    </a>`).join("");
  const setaEsq = $('[data-rolar="-1"]'), setaDir = $('[data-rolar="1"]');
  setaEsq.innerHTML = icone("left"); setaDir.innerHTML = icone("right");
  $$("[data-rolar]").forEach((b) => b.addEventListener("click", () => faixa.scrollBy({ left: Number(b.dataset.rolar) * faixa.clientWidth * 0.8 })));
  faixa.addEventListener("scroll", () => {
    setaEsq.classList.toggle("oculto", faixa.scrollLeft < 10);
    setaDir.classList.toggle("oculto", faixa.scrollLeft + faixa.clientWidth >= faixa.scrollWidth - 10);
  });
  iniciarContagem((h, m, s) => ($("#contagem").textContent = `${h}:${m}:${s}`));

  /* ---------- Recomendados (com "ver mais") ---------- */
  const lista = $("#recomendados");
  const todos = [...RECOMENDADOS.map(produtoPorId), ...PRODUTOS.filter((p) => !RECOMENDADOS.includes(p.id))];
  let mostrando = 0;
  function mostrarMais() {
    const proximos = todos.slice(mostrando, mostrando + 8);
    lista.insertAdjacentHTML("beforeend", proximos.map((p) => produtoLinhaHTML(p, { mostrarDe: false })).join(""));
    mostrando += proximos.length;
    if (mostrando >= todos.length) $("#ver-mais").classList.add("oculto");
  }
  $("#ver-mais").addEventListener("click", mostrarMais);
  mostrarMais();
});
