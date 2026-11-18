/* =========================================================
   APP — funções compartilhadas por todas as páginas
   (ícones, armazenamento, carrinho, favoritos, cabeçalho,
    rodapé, filtro de daltonismo, toast e modal)
   ========================================================= */

/* ---------- Ícones (SVG inline) ---------- */
const ICONES = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  cart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="M4 2C2.8 3.7 2 5.7 2 8"/><path d="M22 8c0-2.3-.8-4.3-2-6"/>',
  user: '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
  percent: '<line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
  truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
  dollar: '<circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/>',
  plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  bagcheck: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="m9 14 2 2 4-4"/>',
  bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  left: '<path d="m15 18-6-6 6-6"/>',
  right: '<path d="m9 18 6-6-6-6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  up: '<path d="m18 15-6-6-6 6"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  box: '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  starcircle: '<circle cx="12" cy="12" r="10"/><polygon points="12 6.5 13.7 10 17.5 10.4 14.6 13 15.4 16.8 12 14.9 8.6 16.8 9.4 13 6.5 10.4 10.3 10"/>',
  aa: '<circle cx="12" cy="12" r="10"/><path d="m6.5 16 2.5-7 2.5 7"/><path d="M7.4 13.6h3.2"/><path d="M17.5 16v-3.2a1.6 1.6 0 0 0-3-.8"/><circle cx="16" cy="14.6" r="1.5"/>',
  gamepad: '<line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><rect width="20" height="12" x="2" y="6" rx="2"/>',
  zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
  lipstick: '<path d="M8 22h8V12H8z"/><path d="M9.5 12V6.5L14.5 3v9"/>',
  basket: '<path d="m15 11-1 9"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/><path d="M4.5 15.5h15"/><path d="m5 11 4-7"/><path d="m9 11 1 9"/>',
  heel: '<path d="M3 17h7.5l3.5-4.5c1.8-2 4.8-2.2 7-.5v5h-5"/><path d="M3 17V8c3.5 0 5.5 3.3 7.5 6.3"/><path d="M4.5 17v4"/>',
  dumbbell: '<path d="M6.5 6.5v11"/><path d="M17.5 6.5v11"/><path d="M3.5 9v6"/><path d="M20.5 9v6"/><path d="M6.5 12h11"/>',
  wheel: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><path d="M12 2v7M12 15v7M2 12h7M15 12h7"/>',
  home: '<path d="M3 10 12 3l9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  paw: '<circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.05Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/>',
  stroller: '<path d="M4 10h14a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M12 10V3a7 7 0 0 1 7 7"/><circle cx="7" cy="19" r="2"/><circle cx="16" cy="19" r="2"/><path d="M2 6h2v4"/>',
  phone: '<rect width="14" height="20" x="5" y="2" rx="2"/><path d="M12 18h.01"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  minus: '<path d="M5 12h14"/>',
  plus: '<path d="M5 12h14M12 5v14"/>',
  dots: '<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  puzzle: '<path d="M19.4 14.6a2 2 0 1 0 0-3.2V7a1 1 0 0 0-1-1h-4.4a2 2 0 1 0-3.2 0H6a1 1 0 0 0-1 1v4.4a2 2 0 1 1 0 3.2V19a1 1 0 0 0 1 1h4.4a2 2 0 1 1 3.2 0H18a1 1 0 0 0 1-1z"/>',
  sprout: '<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>',
  dice: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M16 8h.01M8 8h.01M8 16h.01M16 16h.01M12 12h.01"/>',
  trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
  instagram: '<rect width="20" height="20" x="2" y="2" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
  facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  youtube: '<path d="M2.5 17a24.1 24.1 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.1 24.1 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>',
  tiktok: '<path d="M9 12a4 4 0 1 0 4 4V2a5 5 0 0 0 5 5"/>',
  history: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>',
};

/* ---------- Ícones em imagem (pasta img/) ----------
   Sempre que existe uma imagem para o ícone, ela é usada no lugar do SVG.
   - "mascara": imagem de uma cor só; ganha a cor do texto (currentColor), igual ao SVG,
     então funciona em fundo claro, fundo colorido e com o filtro de daltonismo.
   - "foto": imagem colorida, mostrada como está. */
const ICONES_IMG = {
  cart: { src: "img/shopping-carts 1.png", modo: "mascara" },
  bell: { src: "img/ring-bell 1.png", modo: "mascara" },
  user: { src: "img/profile 1.png", modo: "mascara" },
  percent: { src: "img/Cupom.png", modo: "mascara" },
  truck: { src: "img/truck(2).png", modo: "mascara" },
  dollar: { src: "img/Moeda (2).png", modo: "Mascara" },
  plane: { src: "img/Internacional.png", modo: "mascara" },
  bagcheck: { src: "img/Oficial.png", modo: "mascara" },
  grid: { src: "img/grid.png", modo: "mascara" },
  heart: { src: "img/Favoritos.png", modo: "mascara" },
  message: { src: "img/message-square.png", modo: "mascara" },
  lipstick: { src: "img/Make-Up-Lipstick--Streamline-Ultimate.png", modo: "mascara" },
  basket: { src: "img/Mercado.png", modo: "mascara" },
  heel: { src: "img/Moda.png", modo: "mascara" },
  dumbbell: { src: "img/Esporte.png", modo: "mascara" },
  wheel: { src: "img/Wheel--Streamline-Solar.png", modo: "mascara" },
  home: { src: "img/casa.png", modo: "mascara" },
  paw: { src: "img/Paw-Sharp--Streamline-Ionic-Sharp.png", modo: "mascara" },
  stroller: { src: "img/Bebe.png", modo: "mascara" },
  phone: { src: "img/Tecnologia.png", modo: "mascara" },
  gamepad: { src: "img/Controller--Streamline-Core-Remix.png", modo: "mascara" },
  aa: { src: "img/Acessibilidade.png", modo: "mascara" },
  wallet: { src: "img/A pagar.png", modo: "mascara" },
  box: { src: "img/image 5.png", modo: "mascara" },
  starcircle: { src: "img/Estrela.png", modo: "mascara" },
};
// Ícones que mudam de preenchimento (coração do botão favoritar, estrelas da nota) continuam em SVG.
const SO_SVG = ["icone--svg"];

function icone(nome, classe = "") {
  const img = ICONES_IMG[nome];
  if (img && !SO_SVG.some((c) => classe.split(" ").includes(c))) {
    const url = new URL(img.src, document.baseURI).href; // endereço completo: url() dentro do CSS resolveria a partir da pasta css/
    return img.modo === "foto"
      ? `<img class="icone icone--foto ${classe}" src="${url}" alt="" aria-hidden="true">`
      : `<span class="icone icone--img ${classe}" style="--icone-img:url('${url}')" aria-hidden="true"></span>`;
  }
  return `<svg class="icone ${classe}" viewBox="0 0 24 24" aria-hidden="true">${ICONES[nome] || ""}</svg>`;
}

const LOGO_SVG = `<svg viewBox="0 0 40 46" aria-hidden="true"><path d="M3 13h34l-2.2 29.2a3 3 0 0 1-3 2.8H8.2a3 3 0 0 1-3-2.8z" fill="#fff"/><path d="M12.5 13a7.5 7.5 0 0 1 15 0" stroke="#fff" stroke-width="3" fill="none"/><text x="20" y="37" text-anchor="middle" font-size="22" font-family="Josefin Sans, sans-serif" font-weight="700" class="logo__s">S</text></svg>`;

/* ---------- Armazenamento (localStorage) ---------- */
const Armazem = {
  ler(chave, padrao) {
    try {
      const valor = localStorage.getItem("shopee_" + chave);
      return valor === null ? padrao : JSON.parse(valor);
    } catch (e) { return padrao; }
  },
  salvar(chave, valor) { localStorage.setItem("shopee_" + chave, JSON.stringify(valor)); avisarMudanca(chave); },
};

/* ---------- Sincronização ----------
   Toda gravação no Armazem dispara o evento "shopee:mudou" com a chave alterada.
   O mesmo evento é disparado quando outra aba muda os dados (evento "storage")
   e quando a página volta pelo botão "Voltar" do navegador (cache bfcache, chave "*").
   Cada página usa aoMudar([...chaves], render) para se redesenhar sozinha. */
function avisarMudanca(chave) { document.dispatchEvent(new CustomEvent("shopee:mudou", { detail: { chave } })); }
function aoMudar(chaves, fn) {
  document.addEventListener("shopee:mudou", (e) => { if (e.detail.chave === "*" || chaves.includes(e.detail.chave)) fn(e.detail.chave); });
}
window.addEventListener("storage", (e) => {
  if (e.key === null) return avisarMudanca("*");
  if (e.key.startsWith("shopee_")) avisarMudanca(e.key.slice(7));
});
window.addEventListener("pageshow", (e) => { if (e.persisted) avisarMudanca("*"); });

/* ---------- Utilidades ---------- */
const $ = (sel, raiz = document) => raiz.querySelector(sel);
const $$ = (sel, raiz = document) => Array.from(raiz.querySelectorAll(sel));
const moeda = (v) => "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const notaBR = (n) => n.toFixed(1).replace(".", ",");
const param = (nome) => new URLSearchParams(location.search).get(nome);
const produtoPorId = (id) => PRODUTOS.find((p) => p.id === id);
const lojaPorId = (id) => LOJAS[id] || { id, nome: id };
const iniciais = (nome) => nome.replace(/[^A-Za-zÀ-ú ]/g, "").split(" ").filter(Boolean).slice(0, 2).map((s) => s[0]).join("").toUpperCase();
const escapar = (txt) => String(txt).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const descontoPct = (p) => (p.precoDe ? Math.round((1 - p.preco / p.precoDe) * 100) : 0);

function estrelasHTML(nota, classe = "") {
  let html = `<span class="estrelas ${classe}" aria-label="Nota ${notaBR(nota)} de 5">`;
  for (let i = 1; i <= 5; i++) html += icone("star", i <= Math.round(nota) ? "cheia" : "");
  return html + "</span>";
}

/* Opções de variação de um produto (ex.: "Cinza, 38") */
function variacoesDe(produto) {
  const cores = (produto.cores || []).map((c) => c.nome);
  const tam = produto.tamanhos || [];
  if (cores.length && tam.length) return cores.flatMap((c) => tam.map((t) => `${c}, ${t}`));
  return cores.length ? cores : tam;
}

/* ---------- Favoritos ---------- */
const Favoritos = {
  lista: () => Armazem.ler("favoritos", ["cabeceira", "kuromi", "calca", "relogio"]),
  tem: (id) => Favoritos.lista().includes(id),
  alternar(id) {
    const lista = Favoritos.lista();
    const i = lista.indexOf(id);
    if (i >= 0) lista.splice(i, 1); else lista.unshift(id);
    const ativo = i < 0;
    Armazem.salvar("favoritos", lista); // os corações de todas as telas se atualizam pelo evento de sincronização
    toast(ativo ? "Adicionado aos favoritos" : "Removido dos favoritos", ativo ? "heart" : "x");
    return ativo;
  },
};

function botaoFav(id) {
  const ativo = Favoritos.tem(id);
  return `<button class="fav ${ativo ? "ativo" : ""}" data-fav="${id}" aria-pressed="${ativo}" aria-label="Favoritar">${icone("heart", "icone--svg")}</button>`;
}

/* ---------- Carrinho ---------- */
const Carrinho = {
  itens: () => Armazem.ler("carrinho", [
    { id: "kuromi", qtd: 1, variacao: "Kuromi - Roxo", selecionado: true },
    { id: "calca", qtd: 2, variacao: "Cinza, 38", selecionado: true },
    { id: "base", qtd: 1, variacao: "Bege Claro", selecionado: false },
  ]),
  salvar(itens) { Armazem.salvar("carrinho", itens); },
  adicionar(id, qtd = 1, variacao = "") {
    const itens = Carrinho.itens();
    const existente = itens.find((i) => i.id === id && i.variacao === variacao);
    if (existente) existente.qtd = Math.min(99, existente.qtd + qtd);
    else itens.unshift({ id, qtd, variacao, selecionado: true });
    Carrinho.salvar(itens);
  },
  quantidadeTotal: () => Carrinho.itens().reduce((s, i) => s + i.qtd, 0),
};

/* ---------- Moedas ---------- */
const Moedas = {
  saldo: () => Armazem.ler("moedas", 1314),
  somar(qtd) { Armazem.salvar("moedas", Moedas.saldo() + qtd); },
};

/* ---------- Notificações ---------- */
const Notificacoes = {
  lista() { return [...Armazem.ler("notificacoes_extras", []), ...NOTIFICACOES_PADRAO]; },
  lidas: () => Armazem.ler("notificacoes_lidas", []),
  naoLidas() { const lidas = Notificacoes.lidas(); return Notificacoes.lista().filter((n) => !lidas.includes(n.id)).length; },
  adicionar(n) {
    const extras = Armazem.ler("notificacoes_extras", []);
    extras.unshift({ id: "n" + Date.now() + Math.floor(Math.random() * 1000), quando: Date.now(), ...n });
    Armazem.salvar("notificacoes_extras", extras.slice(0, 20));
  },
  marcarLida(id) { const l = Notificacoes.lidas(); if (!l.includes(id)) { l.push(id); Armazem.salvar("notificacoes_lidas", l); } },
};

function tempoRelativo(ms) {
  const min = Math.floor((Date.now() - ms) / 60000);
  if (min < 1) return "Agora";
  if (min < 60) return `Há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `Há ${h} h`;
  const d = Math.floor(h / 24);
  return d === 1 ? "Ontem" : `${d} dias atrás`;
}

/* ---------- Toast ---------- */
function toast(mensagem, nomeIcone = "check") {
  let caixa = $(".toasts");
  if (!caixa) { caixa = document.createElement("div"); caixa.className = "toasts"; caixa.setAttribute("aria-live", "polite"); document.body.appendChild(caixa); }
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = icone(nomeIcone) + `<span>${escapar(mensagem)}</span>`;
  caixa.appendChild(el);
  setTimeout(() => el.remove(), 2800);
}

/* ---------- Modal ---------- */
function abrirModal({ titulo, corpo, acoes = "" }) {
  fecharModal();
  const fundo = document.createElement("div");
  fundo.className = "modal-fundo";
  fundo.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-label="${escapar(titulo)}">
      <div class="modal__topo"><h3>${titulo}</h3><button data-fechar aria-label="Fechar">${icone("x")}</button></div>
      <div class="modal__corpo">${corpo}</div>
      ${acoes ? `<div class="modal__acoes">${acoes}</div>` : ""}
    </div>`;
  fundo.addEventListener("click", (e) => { if (e.target === fundo || e.target.closest("[data-fechar]")) fecharModal(); });
  document.body.appendChild(fundo);
  const foco = fundo.querySelector("input, select, button:not([data-fechar])");
  if (foco) foco.focus();
  return fundo.querySelector(".modal");
}
function fecharModal() { const m = $(".modal-fundo"); if (m) m.remove(); }
document.addEventListener("keydown", (e) => { if (e.key === "Escape") fecharModal(); });

/* ---------- Popup de avaliação (usado no produto e em Minhas Compras) ---------- */
const ROTULOS_NOTA = ["", "Péssimo", "Ruim", "Regular", "Bom", "Excelente"];
const avaliacoesDoProduto = (produto) => [...Armazem.ler("avaliacoes_" + produto.id, []), ...(produto.avaliacoes || AVALIACOES_PADRAO)];

/* Só quem comprou (pedido pago: preparando, a caminho, entregue ou reembolso) pode avaliar.
   Pedidos "A Pagar" e "Cancelado" não contam. */
const STATUS_COMPRADO = ["preparando", "a-caminho", "finalizado", "reembolso"];
function comprouProduto(produtoId, pedidos = Armazem.ler("pedidos", null) || PEDIDOS_PADRAO) {
  return pedidos.some((p) => STATUS_COMPRADO.includes(p.status) && p.itens.some((i) => i.id === produtoId));
}
function avisoSoQuemComprou() {
  abrirModal({
    titulo: "Avaliação indisponível",
    corpo: `<p>${icone("bag")} Você só pode avaliar este produto depois de comprá-lo.</p><p style="color:var(--texto-suave);font-size:.9rem">Assim que o pagamento do seu pedido for confirmado, a avaliação fica liberada.</p>`,
    acoes: `<button class="botao botao--primario" data-fechar>Entendi</button>`,
  });
}

function abrirFormAvaliacao(produtoId, aoEnviar) {
  const produto = produtoPorId(produtoId);
  if (!produto) return;
  if (!comprouProduto(produto.id)) return avisoSoQuemComprou();
  let nota = 0;
  const modal = abrirModal({
    titulo: "Avaliar produto",
    corpo: `<div class="avaliar-produto"><img src="${produto.img}" alt=""><span>${escapar(produto.nome)}</span></div>
      <div class="campo"><span>Sua nota</span>
        <div class="estrelas-escolha" role="radiogroup" aria-label="Nota do produto">${[1, 2, 3, 4, 5].map((n) => `<button type="button" role="radio" aria-checked="false" aria-label="${n} de 5 — ${ROTULOS_NOTA[n]}" data-n="${n}">${icone("star")}</button>`).join("")}</div>
        <small class="estrelas-escolha__rotulo" id="nota-rotulo">Toque nas estrelas para dar sua nota</small>
      </div>
      <div class="campo"><label for="txt-aval">Comentário</label><textarea id="txt-aval" rows="4" maxlength="500" placeholder="Conte o que achou do produto"></textarea></div>
      <span class="campo-erro oculto" id="erro-aval"></span>
      <p class="avaliar-bonus">${icone("dollar")} Ganhe 10 moedas ao enviar sua avaliação</p>`,
    acoes: `<button class="botao botao--contorno" data-fechar>Cancelar</button><button class="botao botao--primario" id="enviar-aval">${icone("send")} Enviar avaliação</button>`,
  });
  modal.classList.add("modal--avaliar");
  const estrelas = $$("[data-n]", modal);
  const pintar = (ate) => estrelas.forEach((b) => b.classList.toggle("cheia", Number(b.dataset.n) <= ate));
  estrelas.forEach((b) => {
    b.addEventListener("mouseenter", () => pintar(Number(b.dataset.n)));
    b.addEventListener("click", () => {
      nota = Number(b.dataset.n);
      estrelas.forEach((x) => x.setAttribute("aria-checked", String(x === b)));
      $("#nota-rotulo", modal).textContent = ROTULOS_NOTA[nota];
      $("#erro-aval", modal).classList.add("oculto");
      pintar(nota);
    });
  });
  $(".estrelas-escolha", modal).addEventListener("mouseleave", () => pintar(nota));
  $("#enviar-aval", modal).addEventListener("click", () => {
    const texto = $("#txt-aval", modal).value.trim();
    const erro = $("#erro-aval", modal);
    if (!nota) { erro.textContent = "Escolha uma nota de 1 a 5 estrelas."; erro.classList.remove("oculto"); return; }
    if (texto.length < 5) { erro.textContent = "Escreva pelo menos 5 caracteres."; erro.classList.remove("oculto"); return; }
    const nova = { usuario: Armazem.ler("usuario", { nome: "User" }).nome, nota, texto };
    Armazem.salvar("avaliacoes_" + produto.id, [nova, ...Armazem.ler("avaliacoes_" + produto.id, [])]);
    Moedas.somar(10);
    Notificacoes.adicionar({ titulo: "Você ganhou 10 moedas", texto: `Obrigado por avaliar ${produto.nome.slice(0, 40)}…`, link: "moedas.html", icone: "dollar" });
    fecharModal();
    toast("Avaliação enviada! Você ganhou 10 moedas", "star");
    if (aoEnviar) aoEnviar(nova);
  });
}

/* ---------- Contagem regressiva (até o fim do dia) ---------- */
function fimDaOferta() {
  const fim = new Date();
  fim.setHours(Math.ceil((fim.getHours() + 0.01) / 3) * 3, 0, 0, 0); // blocos de 3 horas
  return fim;
}
function iniciarContagem(callback) {
  const passo = () => {
    const resta = Math.max(0, fimDaOferta() - new Date());
    const h = String(Math.floor(resta / 3600000)).padStart(2, "0");
    const m = String(Math.floor((resta % 3600000) / 60000)).padStart(2, "0");
    const s = String(Math.floor((resta % 60000) / 1000)).padStart(2, "0");
    callback(h, m, s);
  };
  passo();
  return setInterval(passo, 1000);
}

/* ---------- Card de produto em lista ---------- */
function produtoLinhaHTML(p, { mostrarDe = true } = {}) {
  return `<article class="produto-linha">
    <a class="produto-linha__img" href="produto.html?id=${p.id}"><img src="${p.img}" alt="${escapar(p.nome)}" loading="lazy"></a>
    ${botaoFav(p.id)}
    <div class="produto-linha__info">
      <a class="produto-linha__nome" href="produto.html?id=${p.id}">${escapar(p.nome)}</a>
      <span class="nota">${icone("star")} ${notaBR(p.nota)}</span>
      ${mostrarDe && p.precoDe ? `<span class="produto-linha__de">${moeda(p.precoDe)} por</span>` : ""}
      <span class="produto-linha__preco">${moeda(p.preco)}</span>
      <span class="produto-linha__local">${icone("pin")} ${p.local}</span>
    </div>
  </article>`;
}

/* ---------- Cabeçalho ---------- */
function montarCabecalho() {
  const topo = $("#topo");
  if (!topo) return;
  const pagina = document.body.dataset.pagina;
  const botoes = [
    { id: "carrinho", href: "carrinho.html", icone: "cart", rotulo: "Carrinho", contador: "carrinho" },
    { id: "notificacoes", icone: "bell", rotulo: "Notificações", contador: "notificacoes", popup: true },
    { id: "perfil", href: "perfil.html", icone: "user", rotulo: "Perfil" },
  ].filter((b) => b.id !== pagina && !(pagina === "pagamento" && b.id === "carrinho"));

 topo.innerHTML = `<div class="container topo__linha">
      <a href="index.html" class="logo" aria-label="Shopee - página inicial">
    <img class="logo__imagem" src="img/shopee-190.png" alt="Shopee">
</a>
      <form class="busca" role="search" autocomplete="off">
        <label class="sr-only" for="campo-busca">Buscar produtos</label>
        <input id="campo-busca" name="q" type="search" placeholder="Barra de busca" value="${escapar(param("q") || "")}">
        <button class="busca__botao" type="submit" aria-label="Buscar">${icone("search")}</button>
        <div class="busca__sugestoes oculto" role="listbox"></div>
      </form>
      <nav class="acoes-topo" aria-label="Atalhos">
        ${botoes.map((b) => {
          const conteudo = icone(b.icone) + (b.contador ? `<span class="contador oculto" data-contador="${b.contador}"></span>` : "");
          return b.popup
            ? `<button class="botao-icone" type="button" data-abrir-notif aria-label="${b.rotulo}" aria-haspopup="dialog" aria-expanded="false" aria-controls="notif-pop">${conteudo}</button>`
            : `<a class="botao-icone" href="${b.href}" aria-label="${b.rotulo}">${conteudo}</a>`;
        }).join("")}
      </nav>
      <div class="notif-pop oculto" id="notif-pop" role="dialog" aria-label="Notificações">
        <div class="notif-pop__topo"><h2>Notificações</h2><span class="notif-pop__novas" id="notif-novas"></span><button type="button" data-fechar-notif aria-label="Fechar notificações">${icone("x")}</button></div>
        <div class="notif-pop__lista" id="notif-lista"></div>
        <div class="notif-pop__rodape"><button type="button" id="notif-ler-tudo">${icone("check")} Ler tudo</button><button type="button" data-fechar-notif>Fechar</button></div>
      </div>
    </div>`;

  // Busca com sugestões
  const form = $(".busca", topo);
  const campo = $("input", form);
  const sugestoes = $(".busca__sugestoes", form);
  let indice = -1;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const ativo = $("a.ativo", sugestoes);
    if (ativo) { location.href = ativo.href; return; }
    const termo = campo.value.trim();
    if (!termo) { campo.focus(); toast("Digite algo para buscar", "search"); return; }
    location.href = "categorias.html?q=" + encodeURIComponent(termo);
  });
  campo.addEventListener("input", () => {
    const termo = normalizar(campo.value.trim());
    indice = -1;
    if (termo.length < 2) { sugestoes.classList.add("oculto"); return; }
    const achados = PRODUTOS.filter((p) => normalizar(p.nome).includes(termo)).slice(0, 6);
    sugestoes.innerHTML = achados.length
      ? achados.map((p) => `<a href="produto.html?id=${p.id}" role="option"><img src="${p.img}" alt="">${escapar(p.nome)}</a>`).join("")
      : `<a href="categorias.html?q=${encodeURIComponent(campo.value)}">Buscar por "${escapar(campo.value)}"</a>`;
    sugestoes.classList.remove("oculto");
  });
  campo.addEventListener("keydown", (e) => {
    const itens = $$("a", sugestoes);
    if (!itens.length || sugestoes.classList.contains("oculto")) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      indice = (indice + (e.key === "ArrowDown" ? 1 : -1) + itens.length) % itens.length;
      itens.forEach((a, i) => a.classList.toggle("ativo", i === indice));
    }
  });
  document.addEventListener("click", (e) => { if (!form.contains(e.target)) sugestoes.classList.add("oculto"); });

  atualizarContadores();
}

/* ---------- Popup de notificações (abre pelo sininho do cabeçalho) ---------- */
function renderNotificacoes() {
  const lista = $("#notif-lista");
  if (!lista) return;
  const lidas = Notificacoes.lidas();
  const itens = Notificacoes.lista();
  lista.innerHTML = itens.length ? itens.map((n) => `<a class="notif ${lidas.includes(n.id) ? "" : "nao-lida"}" href="${n.link}" data-id="${n.id}">
      <div class="notif__img">${n.img ? `<img src="${n.img}" alt="">` : icone(n.icone || "bell")}</div>
      <div><h4>${escapar(n.titulo)}</h4><p>${escapar(n.texto)}</p><time>${n.quando ? tempoRelativo(n.quando) : n.data}</time></div>
    </a>`).join("") : `<div class="vazio">${icone("bell")}<h3>Sem novidades por aqui</h3></div>`;
  const novas = Notificacoes.naoLidas();
  $("#notif-novas").textContent = novas ? `${novas} nova${novas > 1 ? "s" : ""}` : "";
  $("#notif-ler-tudo").disabled = !novas;
}
const notifAberto = () => { const pop = $("#notif-pop"); return pop && !pop.classList.contains("oculto"); };
function abrirNotificacoes() {
  const pop = $("#notif-pop");
  if (!pop) return;
  renderNotificacoes();
  pop.classList.remove("oculto");
  $$("[data-abrir-notif]").forEach((b) => b.setAttribute("aria-expanded", "true"));
  document.body.classList.add("notif-aberto");
  $("#notif-lista").scrollTop = 0;
  pop.querySelector("[data-fechar-notif]").focus();
}
function fecharNotificacoes() {
  const pop = $("#notif-pop");
  if (!pop || pop.classList.contains("oculto")) return;
  pop.classList.add("oculto");
  $$("[data-abrir-notif]").forEach((b) => b.setAttribute("aria-expanded", "false"));
  document.body.classList.remove("notif-aberto");
  if (location.hash === "#notificacoes") history.replaceState(null, "", location.pathname + location.search);
}
document.addEventListener("click", (e) => {
  if (e.target.closest("[data-abrir-notif]")) {
    e.preventDefault();
    if (notifAberto() && e.target.closest(".acoes-topo")) fecharNotificacoes();
    else { window.scrollTo({ top: 0, behavior: "smooth" }); abrirNotificacoes(); }
    return;
  }
  if (e.target.closest("[data-fechar-notif]")) return fecharNotificacoes();
  if (e.target.closest("#notif-ler-tudo")) {
    Notificacoes.lista().forEach((n) => Notificacoes.marcarLida(n.id));
    return toast("Todas as notificações foram lidas");
  }
  const item = e.target.closest("#notif-pop [data-id]");
  if (item) { Notificacoes.marcarLida(item.dataset.id); return; }
  if (notifAberto() && !e.target.closest("#notif-pop")) fecharNotificacoes();
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && notifAberto()) fecharNotificacoes(); });
window.addEventListener("hashchange", () => { if (location.hash === "#notificacoes") abrirNotificacoes(); });
setInterval(() => { if (notifAberto()) renderNotificacoes(); }, 60000); // atualiza o "Há X min"

function normalizar(txt) { return txt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }

function atualizarContadores() {
  const valores = { carrinho: Carrinho.quantidadeTotal(), notificacoes: Notificacoes.naoLidas() };
  $$("[data-contador]").forEach((el) => {
    const v = valores[el.dataset.contador] || 0;
    el.textContent = v > 99 ? "99+" : v;
    el.classList.toggle("oculto", v === 0);
  });
}

/* ---------- Rodapé + filtro de daltonismo ---------- */
const FILTROS = [
  { id: "padrao", nome: "Cores Padrão" },
  { id: "protanopia", nome: "Protanopia" },
  { id: "deuteranopia", nome: "Deuteranopia" },
  { id: "tritanopia", nome: "Tritanopia" },
  { id: "acromatopsia", nome: "Acromatopsia" },
];
function aplicarFiltro(id) {
  if (id === "padrao") delete document.documentElement.dataset.daltonismo;
  else document.documentElement.dataset.daltonismo = id;
  Armazem.salvar("filtro", id);
  $$(".seletor-filtro").forEach((s) => (s.value = id));
}
function seletorFiltroHTML(idCampo) {
  const atual = Armazem.ler("filtro", "padrao");
  return `<select id="${idCampo}" class="seletor-filtro">${FILTROS.map((f) => `<option value="${f.id}" ${f.id === atual ? "selected" : ""}>${f.nome}</option>`).join("")}</select>`;
}
function montarRodape() {
  const rodape = $("#rodape");
  if (!rodape) return;
  rodape.className = "rodape";
  const coluna = (titulo, links) => `<nav class="rodape__coluna" aria-label="${titulo}"><h3>${titulo}</h3><ul>${links.map(([texto, href]) =>
    `<li>${href ? `<a href="${href}">${texto}</a>` : `<button type="button" data-abrir-notif>${texto}</button>`}</li>`).join("")}</ul></nav>`;
  const redes = [
    ["instagram", "Instagram", "https://www.instagram.com/shopee_br/"],
    ["facebook", "Facebook", "https://www.facebook.com/ShopeeBR"],
    ["tiktok", "TikTok", "https://www.tiktok.com/@shopee_br"],
    ["youtube", "YouTube", "https://www.youtube.com/@ShopeeBrasil"],
  ];
  rodape.innerHTML = `<div class="container rodape__grade">
      <div class="rodape__marca">
        <a href="index.html" class="logo" aria-label="Shopee - página inicial">
    <img class="logo__imagem" src="img/shopee-190.png" alt="Shopee">
</a>
        <p>Frete grátis, cupons de desconto, moedas e ofertas relâmpago todos os dias.</p>
        <div class="filtro-daltonismo">
          <label for="filtro-daltonismo">Filtro de daltonismo</label>${seletorFiltroHTML("filtro-daltonismo")}
        </div>
      </div>
      ${coluna("Compras", [["Ofertas Relâmpago", "oferta-relampago.html"], ["Categorias", "categorias.html"], ["Cupons de desconto", "cupons.html"], ["Moedas Shopee", "moedas.html"]])}
      ${coluna("Minha conta", [["Meu perfil", "perfil.html"], ["Minhas compras", "minhas-compras.html"], ["Favoritos", "favoritos.html"], ["Carrinho", "carrinho.html"], ["Notificações", ""]])}
      ${coluna("Atendimento", [["Chat com as lojas", "chat.html"], ["Acompanhar pedido", "minhas-compras.html?status=a-caminho"], ["Cancelamentos", "minhas-compras.html?status=cancelado"], ["Reembolsos", "minhas-compras.html?status=reembolso"]])}
      <div class="rodape__coluna">
        <h3>Pagamento</h3>
        <ul class="rodape__selos"><li>Pix</li><li>Cartão de Crédito</li><li>Boleto</li><li>Moedas Shopee</li></ul>
        <h3>Siga a Shopee</h3>
        <ul class="rodape__redes">${redes.map(([ic, nome, url]) => `<li><a href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${nome}">${icone(ic)}</a></li>`).join("")}</ul>
      </div>
    </div>
    <div class="rodape__base"><div class="container">© ${new Date().getFullYear()} Shopee · Site de demonstração · Brasil</div></div>`;
}
document.addEventListener("change", (e) => { if (e.target.classList.contains("seletor-filtro")) { aplicarFiltro(e.target.value); toast("Filtro de cores aplicado", "check"); } });

// Aplica preferências salvas o quanto antes (evita "piscar")
function aplicarPreferencias() {
  const filtro = Armazem.ler("filtro", "padrao");
  if (filtro !== "padrao") document.documentElement.dataset.daltonismo = filtro;
  else delete document.documentElement.dataset.daltonismo;
  $$(".seletor-filtro").forEach((s) => (s.value = filtro));
  document.documentElement.classList.toggle("fonte-grande", !!Armazem.ler("fonte_grande", false));
}
aplicarPreferencias();

/* ---------- Delegação global de cliques ---------- */
document.addEventListener("click", (e) => {
  const fav = e.target.closest("[data-fav]");
  if (fav) { e.preventDefault(); Favoritos.alternar(fav.dataset.fav); }
});

/* ---------- Sincronização global: contadores, corações e preferências ---------- */
document.addEventListener("shopee:mudou", (e) => {
  const c = e.detail.chave, todas = c === "*";
  if (todas || ["carrinho", "notificacoes_extras", "notificacoes_lidas"].includes(c)) atualizarContadores();
  if (todas || ["notificacoes_extras", "notificacoes_lidas"].includes(c)) renderNotificacoes();
  if (todas || c === "favoritos") {
    const lista = Favoritos.lista();
    $$("[data-fav]").forEach((b) => { const ativo = lista.includes(b.dataset.fav); b.classList.toggle("ativo", ativo); b.setAttribute("aria-pressed", ativo); });
  }
  if (todas || c === "filtro" || c === "fonte_grande") aplicarPreferencias();
});

/* ---------- Inicialização ---------- */
function preencherIcones(raiz = document) {
  $$("[data-icone]", raiz).forEach((el) => { el.innerHTML = icone(el.dataset.icone); el.removeAttribute("data-icone"); });
}

/* ---------- Botão "Voltar" (volta para a página anterior) ---------- */
function montarVoltar() {
  if (document.body.dataset.pagina === "home") return;
  const main = $("main");
  if (!main) return;
  const botao = document.createElement("button");
  botao.type = "button";
  botao.className = "botao-voltar";
  botao.setAttribute("aria-label", "Voltar para a página anterior");
  botao.innerHTML = icone("left") + "<span>Voltar</span>";
  botao.addEventListener("click", () => {
    // Se a página foi aberta direto (sem histórico), vai para a página inicial
    if (history.length > 1) history.back();
    else location.href = "index.html";
  });
  main.prepend(botao);
}

document.addEventListener("DOMContentLoaded", () => {
  montarCabecalho();
  montarVoltar();
  montarRodape();
  preencherIcones();
  if (location.hash === "#notificacoes") abrirNotificacoes();
});
