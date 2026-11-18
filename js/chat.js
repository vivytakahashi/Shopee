/* =========================================================
   CHAT — lista de conversas, troca de mensagens e
   resposta automática da loja (salvo no navegador)
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const PADRAO = {
    loja1: [{ de: "loja", texto: "Olá! Sua cabeceira já foi enviada 😊", hora: "09:12" }],
    dengo: [{ de: "eu", texto: "Oi, a pelúcia é original?", hora: "10:02" }, { de: "loja", texto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sim, é original!", hora: "10:05" }],
  };
  let conversas = Armazem.ler("conversas", PADRAO);
  let atual = null;
  const lista = $("#conversas");
  const caixa = $("#mensagens");
  const campo = $("#campo-mensagem");
  const agora = () => new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const salvar = () => Armazem.salvar("conversas", conversas);

  // Abre conversa vinda da página de produto (?loja=...&produto=...)
  const lojaParam = param("loja");
  if (lojaParam && LOJAS[lojaParam]) {
    if (!conversas[lojaParam]) conversas[lojaParam] = [];
    const prod = produtoPorId(param("produto"));
    if (prod && !conversas[lojaParam].some((m) => m.produto === prod.id)) conversas[lojaParam].push({ de: "eu", texto: `Olá! Tenho interesse no produto: ${prod.nome}`, hora: agora(), produto: prod.id });
    salvar();
  }

  function renderLista(filtro = "") {
    const ids = Object.keys(conversas).filter((id) => normalizar(lojaPorId(id).nome).includes(normalizar(filtro)));
    lista.innerHTML = ids.length ? ids.map((id) => {
      const loja = lojaPorId(id);
      const ultima = conversas[id][conversas[id].length - 1];
      return `<button class="conversa ${id === atual ? "ativo" : ""}" data-loja="${id}"><span class="avatar">${iniciais(loja.nome)}</span><span class="conversa__txt"><strong>${loja.nome}</strong><small>${ultima ? escapar(ultima.texto) : "Diga olá 👋"}</small></span></button>`;
    }).join("") : '<p class="vazio" style="padding:20px">Nenhuma conversa encontrada</p>';
  }

  function abrir(id) {
    atual = id;
    const loja = lojaPorId(id);
    $("#chat-cabeca").classList.remove("oculto");
    $("#chat-cabeca").innerHTML = `<span class="avatar">${iniciais(loja.nome)}</span><div>${loja.nome}<div class="status-online">Online</div></div>`;
    campo.disabled = false; campo.focus();
    renderLista($("#busca-conversa").value);
    renderMensagens();
  }

  function renderMensagens() {
    const msgs = conversas[atual] || [];
    caixa.innerHTML = msgs.length ? msgs.map((m) => `<div class="msg msg--${m.de}">${escapar(m.texto)}<time>${m.hora}</time></div>`).join("") : '<p class="chat__vazio">Envie a primeira mensagem para a loja</p>';
    caixa.scrollTop = caixa.scrollHeight;
  }

  lista.addEventListener("click", (e) => { const b = e.target.closest("[data-loja]"); if (b) abrir(b.dataset.loja); });
  $("#busca-conversa").addEventListener("input", (e) => renderLista(e.target.value));

  $("#form-mensagem").addEventListener("submit", (e) => {
    e.preventDefault();
    const texto = campo.value.trim();
    if (!texto || !atual) return;
    const lojaDaVez = atual;
    conversas[lojaDaVez].push({ de: "eu", texto, hora: agora() });
    campo.value = ""; salvar(); renderMensagens(); renderLista($("#busca-conversa").value);

    // Resposta automática da loja
    const digitando = document.createElement("div");
    digitando.className = "msg msg--loja msg--digitando"; digitando.textContent = "digitando...";
    caixa.appendChild(digitando); caixa.scrollTop = caixa.scrollHeight;
    setTimeout(() => {
      const respostas = conversas[lojaDaVez].filter((m) => m.de === "loja").length;
      conversas[lojaDaVez].push({ de: "loja", texto: RESPOSTAS_LOJA[respostas % RESPOSTAS_LOJA.length], hora: agora() });
      salvar();
      if (atual === lojaDaVez) renderMensagens(); else digitando.remove();
      renderLista($("#busca-conversa").value);
    }, 1300);
  });

  renderLista();
  abrir(lojaParam && conversas[lojaParam] ? lojaParam : Object.keys(conversas)[0]);
});
