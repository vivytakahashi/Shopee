/* =========================================================
   OFERTA RELÂMPAGO — contagem regressiva, horários e lista
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  /* Relógios decorativos ao redor do banner */
  const relogios = [
    { x: 0, y: 0, t: 40, i: "down" }, { x: 6, y: 5, t: 100, i: "down" }, { x: 1, y: 33, t: 70, i: "down" }, { x: 11, y: 49, t: 30, i: "right" },
    { x: -3, y: 58, t: 110, i: "" }, { x: 6, y: 64, t: 84, i: "up" }, { x: 84, y: 9, t: 96, i: "down" }, { x: 84, y: 37, t: 34, i: "left" },
    { x: 92, y: 36, t: 70, i: "up" }, { x: 84, y: 54, t: 86, i: "up" }, { x: 96, y: 64, t: 46, i: "up" }, { x: 97, y: 2, t: 110, i: "" },
  ];
  $("#relogios").innerHTML = relogios.map((r) => `<span class="relogio-deco" style="left:${r.x}%;top:${r.y}%;width:${r.t}px;height:${r.t}px">${r.i ? icone(r.i) : ""}</span>`).join("");

  iniciarContagem((h, m, s) => { $("#h").textContent = h; $("#m").textContent = m; $("#s").textContent = s; });

  /* Horários das ofertas (blocos de 3h) */
  const agora = new Date().getHours();
  const blocoAtual = Math.floor(agora / 3) * 3;
  const horarios = [0, 1, 2, 3].map((k) => (blocoAtual + k * 3) % 24);
  let selecionado = 0;
  function renderHorarios() {
    $("#horarios").innerHTML = horarios.map((h, i) => `<button class="horario ${i === selecionado ? "ativo" : ""}" data-h="${i}">${String(h).padStart(2, "0")}:00<small>${i === 0 ? "Acontecendo" : "Em breve"}</small></button>`).join("");
  }
  $("#horarios").addEventListener("click", (e) => {
    const b = e.target.closest("[data-h]"); if (!b) return;
    selecionado = Number(b.dataset.h); renderHorarios(); renderLista();
  });

  function renderLista() {
    const ofertas = PRODUTOS.filter((p) => p.relampago);
    // Cada horário mostra uma "rodada" diferente de produtos
    const lista = selecionado === 0 ? ofertas : ofertas.slice(selecionado * 2).concat(ofertas.slice(0, selecionado * 2));
    $("#lista-oferta").innerHTML = lista.map((p) => produtoLinhaHTML(p)).join("");
    if (selecionado > 0) $$("#lista-oferta .produto-linha__preco").forEach((el) => (el.textContent = "R$ ??,??"));
  }

  renderHorarios();
  renderLista();
});
