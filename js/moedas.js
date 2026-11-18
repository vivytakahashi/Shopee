/* =========================================================
   MOEDAS — saldo, check-in diário (7 dias) e jogos
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const hoje = () => new Date().toISOString().slice(0, 10);
  const ontem = () => { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10); };

  function lerCheckin() {
    const c = Armazem.ler("checkin", { sequencia: 0, ultimo: null });
    // Perdeu um dia? A sequência recomeça. Completou 7? Recomeça também.
    if (c.ultimo && c.ultimo !== hoje() && c.ultimo !== ontem()) c.sequencia = 0;
    if (c.sequencia >= 7 && c.ultimo !== hoje()) c.sequencia = 0;
    return c;
  }

  function render() {
    const c = lerCheckin();
    const feitoHoje = c.ultimo === hoje();
    $("#saldo").textContent = Moedas.saldo().toLocaleString("pt-BR");
    $("#dias").innerHTML = RECOMPENSAS_CHECKIN.map((v, i) => {
      const feito = i < c.sequencia;
      const ehHoje = !feitoHoje && i === c.sequencia;
      return i === 6
        ? `<div class="dia dia--bonus ${feito ? "feito" : ""} ${ehHoje ? "hoje" : ""}"><span>Até ${v}</span><span class="moeda" style="margin:10px 0">S</span></div>`
        : `<div class="dia ${feito ? "feito" : ""} ${ehHoje ? "hoje" : ""}"><span>+${v}</span><span class="moeda">S</span></div>`;
    }).join("");
    const btn = $("#checkin");
    btn.disabled = feitoHoje;
    btn.textContent = feitoHoje ? "Volte amanhã" : "Check-in";
    $("#dica-checkin").textContent = feitoHoje ? `Check-in feito! Sequência de ${c.sequencia} dia(s).` : `Dia ${c.sequencia + 1} de 7 — ganhe ${c.sequencia === 6 ? "até 100" : RECOMPENSAS_CHECKIN[c.sequencia]} moeda(s) hoje`;
  }

  $("#checkin").addEventListener("click", () => {
    const c = lerCheckin();
    if (c.ultimo === hoje()) return;
    let ganho = RECOMPENSAS_CHECKIN[c.sequencia];
    if (c.sequencia === 6) ganho = 20 + Math.floor(Math.random() * 81); // bônus do 7º dia: até 100
    c.sequencia += 1; c.ultimo = hoje();
    Armazem.salvar("checkin", c);
    Moedas.somar(ganho);
    Notificacoes.adicionar({ titulo: `Check-in feito: +${ganho} moedas`, texto: `Sequência de ${c.sequencia} dia(s). Volte amanhã para continuar ganhando!`, link: "moedas.html", icone: "dollar" });
    toast(`Você ganhou ${ganho} moedas!`, "dollar");
  });

  /* ---------- Jogos ---------- */
  // Jogos com as imagens da pasta img/ (os três primeiros podem ser jogados aqui no site)
  const JOGOS = [
    { id: "roleta", nome: "Shopee Prêmios", img: "img/premios.png" },
    { id: "caixa", nome: "Recompensas Diárias", img: "img/Recompensa.png" },
    { id: "dado", nome: "Shopee Figurinhas", img: "img/Figurinha.png" },
    { id: "candy", nome: "Shopee Candy", img: "img/Candy.png" },
    { id: "bolhas", nome: "Shopee Bolhas", img: "img/Bolhas.png" },
    { id: "colheita", nome: "Shopee Colheita", img: "img/colheita.png" },
    { id: "pecas", nome: "Shopee Junta Peças", img: "img/pecas.png" },
    { id: "doacoes", nome: "Shopee Doações", img: "img/doacoes.png" },
  ];
  $("#jogos").innerHTML = JOGOS.map((j) => `<button class="jogo" data-jogo="${j.id}"><img class="jogo__img" src="${j.img}" alt="" loading="lazy">${j.nome}</button>`).join("");
  $("#jogos").addEventListener("click", (e) => {
    const b = e.target.closest("[data-jogo]"); if (!b) return;
    const id = b.dataset.jogo;
    if (id === "roleta" || id === "caixa" || id === "dado") return jogar(id);
    abrirModal({ titulo: b.textContent, corpo: "<p>Este jogo está disponível no app da Shopee. Baixe para jogar e ganhar ainda mais moedas!</p>", acoes: '<button class="botao botao--primario" data-fechar>Ok</button>' });
  });

  function jogar(id) {
    const chave = "jogo_" + id;
    if (Armazem.ler(chave, null) === hoje()) return toast("Você já jogou hoje. Volte amanhã!", "clock");
    const jogo = JOGOS.find((j) => j.id === id);
    const nomes = { [id]: jogo.nome };
    const modal = abrirModal({
      titulo: nomes[id],
      corpo: id === "roleta" ? '<div class="roleta" id="roleta"></div><p style="text-align:center" id="resultado-jogo">Gire para ganhar de 1 a 20 moedas</p>'
        : `<div class="jogo-modal__img" id="icone-jogo"><img src="${jogo.img}" alt=""></div><p style="text-align:center" id="resultado-jogo">Tente a sorte e ganhe de 1 a 20 moedas</p>`,
      acoes: `<button class="botao botao--primario" id="jogar">${id === "roleta" ? "Girar" : id === "caixa" ? "Abrir" : "Jogar"}</button>`,
    });
    $("#jogar", modal).addEventListener("click", (e) => {
      e.currentTarget.disabled = true;
      const ganho = 1 + Math.floor(Math.random() * 20);
      const alvo = $("#roleta", modal) || $("#icone-jogo", modal);
      alvo.style.transition = "transform 2.5s cubic-bezier(.2,.8,.2,1)";
      alvo.style.transform = `rotate(${1440 + Math.random() * 360}deg)`;
      setTimeout(() => {
        Armazem.salvar(chave, hoje()); Moedas.somar(ganho);
        Notificacoes.adicionar({ titulo: `${nomes[id]}: +${ganho} moedas`, texto: "Use suas moedas para pagar até 25% do pedido.", link: "moedas.html", icone: "dollar" });
        $("#resultado-jogo", modal).innerHTML = `<strong class="preco" style="font-size:1.4rem">+${ganho} moedas!</strong>`;
        toast(`Você ganhou ${ganho} moedas!`, "dollar");
      }, 2600);
    });
  }

  aoMudar(["moedas", "checkin"], render);
  render();
});
