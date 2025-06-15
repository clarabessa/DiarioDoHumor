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

  const dataCompleta = new Date();
  const dia = String(dataCompleta.getDate()).padStart(2, '0');
  const mes = String(dataCompleta.getMonth() + 1).padStart(2, '0');
  const ano = dataCompleta.getFullYear();
  const dataFormatada = `${dia}/${mes}/${ano}`;

  humorPorUsuario[nomeUsuario][hoje].push({
    emoji: emojiSelecionado,
    motivo,
    data: dataFormatada
  });

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
      humorSemana[i].forEach((h, index) => {
        const emojiImg = getEmojiImage(h.emoji);
        container.innerHTML += `<p>
          ${dias[i]} (${h.data}): <img src="${emojiImg}" alt="${h.emoji}" style="width: 24px; vertical-align: middle;"> - "${h.motivo}"
          <button class="btn-excluir" onclick="removerHumor(${i}, ${index})">EXCLUIR</button>
        </p>`;
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

const emojiLogo = document.getElementById("emojiLogo");

if (emojiLogo) {

  emojiLogo.src = "img/piscada2.png";

  setInterval(() => {
    emojiLogo.src = "img/piscada.png";

    setTimeout(() => {
      emojiLogo.src = "img/piscada2.png";
    }, 1200);
  }, 2000);
}

function removerHumor(dia, indice) {
  if (confirm("Tem certeza que deseja excluir este humor?")) {
    humorPorUsuario[nomeUsuario][dia].splice(indice, 1);

    if (humorPorUsuario[nomeUsuario][dia].length === 0) {
      delete humorPorUsuario[nomeUsuario][dia];
    }

    localStorage.setItem("humorPorUsuario", JSON.stringify(humorPorUsuario));
    mostrarHistorico();
  }
}