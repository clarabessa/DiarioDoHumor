const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
let humorPorUsuario = JSON.parse(localStorage.getItem("humorPorUsuario")) || {};
let nomeUsuario = localStorage.getItem("nomeUsuario") || "";
let emojiSelecionado = "";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".emoji-options img").forEach(img => {
    img.addEventListener("click", () => {
      document.querySelectorAll(".emoji-options img").forEach(i => i.classList.remove("selected"));
      img.classList.add("selected");
      emojiSelecionado = img.dataset.emoji;
    });
  });

  if (nomeUsuario) iniciarApp();
});

function salvarNome() {
  const nome = document.getElementById("nomeUsuario").value.trim();
  if (nome.length <= 2) {
    alert("Nome inválido: o nome deve ter mais de 2 letras.");
    return;
  }
  localStorage.setItem("nomeUsuario", nome);
  nomeUsuario = nome;
  iniciarApp();
}

function iniciarApp() {
  document.getElementById("entrada-nome").style.display = "none";
  document.getElementById("app").style.display = "block";
  document.getElementById("boasVindas").innerText = `Bem-vindo(a), ${nomeUsuario}!`;
  mostrarHistorico();
}

function salvarHumor() {
  if (!emojiSelecionado) {
    alert("Selecione um emoji!");
    return;
  }

  const motivo = document.getElementById("motivo").value.trim();
  if (!motivo) {
    alert("Digite um motivo.");
    return;
  }

  const hoje = new Date().getDay();

  if (!humorPorUsuario[nomeUsuario]) {
    humorPorUsuario[nomeUsuario] = {};
  }

  if (!humorPorUsuario[nomeUsuario][hoje]) {
    humorPorUsuario[nomeUsuario][hoje] = [];
  }

  humorPorUsuario[nomeUsuario][hoje].push({ emoji: emojiSelecionado, motivo });
  localStorage.setItem("humorPorUsuario", JSON.stringify(humorPorUsuario));

  document.getElementById("motivo").value = "";
  emojiSelecionado = "";
  document.querySelectorAll(".emoji-options img").forEach(i => i.classList.remove("selected"));

  mostrarHistorico();
}

function mostrarHistorico() {
  const container = document.getElementById("historico");
  const resumoContainer = document.getElementById("resumo");
  container.innerHTML = "";
  resumoContainer.innerHTML = "";

  const humorSemana = humorPorUsuario[nomeUsuario] || {};
  let contagem = {};

  for (let i = 0; i < 7; i++) {
    if (humorSemana[i]) {
      humorSemana[i].forEach(h => {
        const emojiImg = getEmojiImage(h.emoji);
        container.innerHTML += `<p>${dias[i]}: <img src="${emojiImg}" alt="${h.emoji}" style="width: 24px; vertical-align: middle;"> - "${h.motivo}"</p>`;
        contagem[h.emoji] = (contagem[h.emoji] || 0) + 1;
      });
    }
  }

  let resumoHTML = "<div class='frequency'>";
  for (const [emoji, count] of Object.entries(contagem)) {
    const emojiImg = getEmojiImage(emoji);
    resumoHTML += `<img src="${emojiImg}" alt="${emoji}" class="emoji-resumo"> x${count} `;
  }
  resumoHTML += "</div>";
  resumoContainer.innerHTML = resumoHTML;
}

function getEmojiImage(emoji) {
  const mapa = {
    ":D": "img/feliz.png",
    ":|": "img/indiferente.png",
    ":C": "img/triste.png",
    ":@": "img/irritado.png",
    "ZzZ": "img/sono.png",
    "<3": "img/apaixonado.png",
    ":S": "img/enjoado.png"
  };
  return mapa[emoji] || "";
}

function trocarUsuario() {
  localStorage.removeItem("nomeUsuario");
  location.reload();
}
