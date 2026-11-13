const dataBatizado = new Date(2027, 0, 17, 10, 30, 0);

const campos = {
  dias: document.getElementById("dias"),
  horas: document.getElementById("horas"),
  minutos: document.getElementById("minutos"),
  segundos: document.getElementById("segundos")
};

const mensagem = document.getElementById("mensagemContagem");

function atualizarContagem() {
  const agora = new Date();
  const diferenca = dataBatizado.getTime() - agora.getTime();

  if (diferenca <= 0) {
    Object.values(campos).forEach((campo) => {
      if (campo) campo.textContent = "00";
    });
    if (mensagem) {
      mensagem.textContent = "Hoje é o dia dessa bênção! Que seja uma celebração inesquecível.";
    }
    return;
  }

  const total = Math.floor(diferenca / 1000);
  const valores = {
    dias: Math.floor(total / 86400),
    horas: Math.floor((total % 86400) / 3600),
    minutos: Math.floor((total % 3600) / 60),
    segundos: total % 60
  };

  Object.entries(valores).forEach(([chave, valor]) => {
    if (campos[chave]) campos[chave].textContent = String(valor).padStart(2, "0");
  });
}

atualizarContagem();
setInterval(atualizarContagem, 1000);

// Música do convite
const musica = document.getElementById("musicaConvite");
const controleMusica = document.getElementById("controleMusica");
const textoMusica = document.getElementById("textoMusica");

function mostrarEstado(estado) {
  if (!controleMusica || !textoMusica) return;

  if (estado === "tocando") {
    textoMusica.textContent = "Silenciar música";
    controleMusica.setAttribute("aria-label", "Silenciar música");
    controleMusica.setAttribute("aria-pressed", "true");
    controleMusica.classList.add("ativo");
  } else if (estado === "silenciada") {
    textoMusica.textContent = "Ativar música";
    controleMusica.setAttribute("aria-label", "Ativar música");
    controleMusica.setAttribute("aria-pressed", "false");
    controleMusica.classList.remove("ativo");
  } else {
    textoMusica.textContent = "Toque para ouvir";
    controleMusica.setAttribute("aria-label", "Iniciar música");
    controleMusica.setAttribute("aria-pressed", "false");
    controleMusica.classList.remove("ativo");
  }
}

async function iniciarMusica() {
  if (!musica) return false;

  try {
    musica.muted = false;
    musica.volume = 0.65;
    await musica.play();
    mostrarEstado("tocando");
    return true;
  } catch (erro) {
    // Autoplay com som pode ser bloqueado pelo navegador.
    mostrarEstado("bloqueada");
    return false;
  }
}

if (musica && controleMusica) {
  // Tenta iniciar automaticamente assim que o script chega ao fim do HTML.
  iniciarMusica();

  // Clique explícito sempre tenta iniciar se estiver pausada.
  controleMusica.addEventListener("click", async () => {
    if (musica.paused || musica.ended) {
      await iniciarMusica();
      return;
    }

    if (musica.muted || musica.volume === 0) {
      musica.muted = false;
      musica.volume = 0.65;
      mostrarEstado("tocando");
    } else {
      musica.muted = true;
      mostrarEstado("silenciada");
    }
  });

  // Se o autoplay foi bloqueado, o primeiro gesto na página tenta liberar o áudio.
  const tentarNoPrimeiroGesto = async () => {
    if (musica.paused) await iniciarMusica();
    document.removeEventListener("pointerdown", tentarNoPrimeiroGesto);
    document.removeEventListener("touchstart", tentarNoPrimeiroGesto);
    document.removeEventListener("keydown", tentarNoPrimeiroGesto);
  };

  document.addEventListener("pointerdown", tentarNoPrimeiroGesto, { once: true });
  document.addEventListener("touchstart", tentarNoPrimeiroGesto, { once: true, passive: true });
  document.addEventListener("keydown", tentarNoPrimeiroGesto, { once: true });

  musica.addEventListener("play", () => mostrarEstado("tocando"));
  musica.addEventListener("error", () => {
    if (textoMusica) textoMusica.textContent = "Música indisponível";
    controleMusica.setAttribute("aria-label", "Música indisponível");
    controleMusica.setAttribute("aria-pressed", "false");
    controleMusica.classList.remove("ativo");
  });
}
