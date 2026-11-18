/* =========================================================
   PERFIL — dados do usuário, atalhos e acessibilidade
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  let usuario = Armazem.ler("usuario", { nome: "User" });
  const contar = (id, n) => { const el = $(id); el.textContent = n; el.classList.toggle("oculto", !n); };
  const atalhos = [
    { status: "a-pagar", nome: "A pagar", icone: "wallet" },
    { status: "preparando", nome: "Preparando", icone: "box" },
    { status: "a-caminho", nome: "A caminho", icone: "truck" },
    { status: "finalizado", nome: "A Avaliar", icone: "starcircle" },
  ];

  function render() {
    usuario = Armazem.ler("usuario", { nome: "User" });
    $("#nome-usuario").textContent = usuario.nome;
    contar("#qtd-favoritos", Favoritos.lista().length);
    contar("#qtd-cupons", Armazem.ler("cupons_resgatados", []).length);
    const pedidos = Armazem.ler("pedidos", null) || PEDIDOS_PADRAO;
    $("#atalhos-compras").innerHTML = atalhos.map((a) => {
      const n = pedidos.filter((p) => p.status === a.status).length;
      return `<a class="perfil-atalho" href="minhas-compras.html?status=${a.status}">${icone(a.icone)}${a.nome}${n ? `<span class="contador">${n}</span>` : ""}</a>`;
    }).join("");
  }
  aoMudar(["usuario", "favoritos", "cupons_resgatados", "pedidos"], render);
  render();

  $("#configuracoes").addEventListener("click", () => {
    const modal = abrirModal({
      titulo: "Configurações da conta",
      corpo: `<div class="campo"><label for="nome">Nome de usuário</label><input id="nome" value="${escapar(usuario.nome)}" maxlength="30"></div>
              <span class="campo-erro oculto" id="erro-nome">O nome precisa ter pelo menos 2 letras.</span>
              <button class="botao botao--contorno botao--sm" id="limpar" style="margin-top:10px">Restaurar dados de demonstração</button>`,
      acoes: `<button class="botao botao--contorno" data-fechar>Cancelar</button><button class="botao botao--primario" id="salvar">Salvar</button>`,
    });
    $("#salvar", modal).addEventListener("click", () => {
      const nome = $("#nome", modal).value.trim();
      if (nome.length < 2) return $("#erro-nome", modal).classList.remove("oculto");
      Armazem.salvar("usuario", { nome });
      fecharModal(); toast("Perfil atualizado");
    });
    $("#limpar", modal).addEventListener("click", () => {
      Object.keys(localStorage).filter((k) => k.startsWith("shopee_")).forEach((k) => localStorage.removeItem(k));
      location.reload();
    });
  });

  $("#acessibilidade").addEventListener("click", () => {
    const grande = document.documentElement.classList.contains("fonte-grande");
    const modal = abrirModal({
      titulo: "Acessibilidade",
      corpo: `<div class="campo"><label for="filtro-modal">Filtro de daltonismo</label>${seletorFiltroHTML("filtro-modal")}</div>
              <label class="opcao-modal" style="justify-content:space-between"><span><strong>Texto maior</strong><small>Aumenta o tamanho das letras do site</small></span><input type="checkbox" class="check" id="fonte" ${grande ? "checked" : ""}></label>`,
      acoes: `<button class="botao botao--primario" data-fechar>Pronto</button>`,
    });
    $("#fonte", modal).addEventListener("change", (e) => {
      document.documentElement.classList.toggle("fonte-grande", e.target.checked);
      Armazem.salvar("fonte_grande", e.target.checked);
    });
  });
});
