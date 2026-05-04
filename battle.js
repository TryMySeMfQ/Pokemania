const POKEMON_LIMIT = 151;
const BASE_LEVEL = 50;

const playerImg = document.getElementById("player-img");
const enemyImg = document.getElementById("enemy-img");
const playerHP = document.getElementById("player-hp");
const enemyHP = document.getElementById("enemy-hp");
const playerHPText = document.getElementById("player-hp-text");
const enemyHPText = document.getElementById("enemy-hp-text");
const playerName = document.getElementById("player-name");
const enemyName = document.getElementById("enemy-name");
const playerLevel = document.getElementById("player-level");
const enemyLevel = document.getElementById("enemy-level");
const battleLog = document.getElementById("battle-log");
const attackButtons = document.querySelectorAll(".attack-btn");
const restartBtn = document.getElementById("restart-btn");

let meuTime = JSON.parse(localStorage.getItem("meuTime")) || [];
let playerAtual = 0;
let jogador = null;
let inimigo = null;
let turnoBloqueado = true;
let batalhaTerminou = false;

const ataquesBase = [
  { nome: "Investida", poder: 35, precisao: 95 },
  { nome: "Ataque Rapido", poder: 28, precisao: 100 },
  { nome: "Golpe Forte", poder: 48, precisao: 80 },
  { nome: "Especial", poder: 58, precisao: 70 }
];

function textoNome(nome) {
  return nome
    .split("-")
    .map(parte => parte.charAt(0).toUpperCase() + parte.slice(1))
    .join(" ");
}

function numeroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function limitarValor(valor, min, max) {
  return Math.min(Math.max(valor, min), max);
}

function getStat(pokemon, statName) {
  const stat = pokemon.stats.find(item => item.stat.name === statName);
  return stat ? stat.base_stat : 50;
}

function criarSpriteUrl(id, costas = false) {
  const lado = costas ? "back/" : "";
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${lado}${id}.png`;
}

async function buscarPokemon(id) {
  const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

  if (!resposta.ok) {
    throw new Error("Nao foi possivel carregar o Pokemon.");
  }

  return resposta.json();
}

function criarLutador(dados, costas = false) {
  const hpMax = getStat(dados, "hp") + 60;

  return {
    id: dados.id,
    nome: textoNome(dados.name),
    nivel: BASE_LEVEL,
    hpAtual: hpMax,
    hpMax,
    ataque: getStat(dados, "attack"),
    defesa: getStat(dados, "defense"),
    velocidade: getStat(dados, "speed"),
    sprite: criarSpriteUrl(dados.id, costas),
    ataques: criarAtaques(dados)
  };
}

function criarAtaques(dados) {
  const movimentos = dados.moves
    .slice(0, 4)
    .map((movimento, index) => ({
      ...ataquesBase[index],
      nome: textoNome(movimento.move.name)
    }));

  while (movimentos.length < 4) {
    movimentos.push(ataquesBase[movimentos.length]);
  }

  return movimentos;
}

async function iniciarBatalha() {
  try {
    if (meuTime.length === 0) {
      alert("Selecione Pokemon primeiro!");
      window.location.href = "selecao.html";
      return;
    }

    bloquearBotoes(true);
    battleLog.textContent = "Preparando a batalha...";

    const idInimigo = numeroAleatorio(1, POKEMON_LIMIT);
    const [dadosJogador, dadosInimigo] = await Promise.all([
      buscarPokemon(meuTime[playerAtual].id),
      buscarPokemon(idInimigo)
    ]);

    jogador = criarLutador(dadosJogador, true);
    inimigo = criarLutador(dadosInimigo);

    renderizarLutadores();
    configurarBotoesAtaque();

    battleLog.textContent = `Um ${inimigo.nome} selvagem apareceu!`;
    turnoBloqueado = false;
    bloquearBotoes(false);
  } catch (erro) {
    battleLog.textContent = "Erro ao carregar a batalha. Tente novamente.";
    console.error(erro);
  }
}

function renderizarLutadores() {
  playerImg.src = jogador.sprite;
  enemyImg.src = inimigo.sprite;

  playerName.textContent = jogador.nome;
  enemyName.textContent = inimigo.nome;
  playerLevel.textContent = `Lv. ${jogador.nivel}`;
  enemyLevel.textContent = `Lv. ${inimigo.nivel}`;

  atualizarHP();
}

function configurarBotoesAtaque() {
  attackButtons.forEach((botao, index) => {
    const ataque = jogador.ataques[index];
    botao.textContent = ataque.nome;
    botao.title = `Poder ${ataque.poder} | Precisao ${ataque.precisao}%`;
  });
}

function atualizarHP() {
  atualizarBarraHP(playerHP, playerHPText, jogador);
  atualizarBarraHP(enemyHP, enemyHPText, inimigo);
}

function atualizarBarraHP(barra, texto, lutador) {
  const porcentagem = limitarValor((lutador.hpAtual / lutador.hpMax) * 100, 0, 100);

  barra.style.width = `${porcentagem}%`;
  texto.textContent = `${lutador.hpAtual}/${lutador.hpMax}`;

  barra.classList.toggle("warning", porcentagem <= 50 && porcentagem > 20);
  barra.classList.toggle("danger", porcentagem <= 20);
}

function bloquearBotoes(bloquear) {
  attackButtons.forEach(botao => {
    botao.disabled = bloquear;
  });
}

function animarAtaque(atacanteImg, alvoImg) {
  atacanteImg.classList.add("attack");

  setTimeout(() => {
    atacanteImg.classList.remove("attack");
    alvoImg.classList.add("hit");

    setTimeout(() => {
      alvoImg.classList.remove("hit");
    }, 300);
  }, 250);
}

function calcularDano(atacante, defensor, ataque) {
  const acertou = numeroAleatorio(1, 100) <= ataque.precisao;

  if (!acertou) {
    return { dano: 0, errou: true, critico: false };
  }

  const critico = Math.random() < 0.12;
  const variacao = numeroAleatorio(85, 100) / 100;
  const bruto = (((2 * atacante.nivel / 5 + 2) * ataque.poder * atacante.ataque / defensor.defesa) / 50 + 2);
  const dano = Math.max(1, Math.floor(bruto * variacao * (critico ? 1.6 : 1)));

  return { dano, errou: false, critico };
}

function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function usarAtaque(atacante, defensor, ataque, atacanteImg, defensorImg) {
  battleLog.textContent = `${atacante.nome} usou ${ataque.nome}!`;
  animarAtaque(atacanteImg, defensorImg);
  await esperar(550);

  const resultado = calcularDano(atacante, defensor, ataque);

  if (resultado.errou) {
    battleLog.textContent = `${atacante.nome} errou o ataque!`;
    await esperar(750);
    return;
  }

  defensor.hpAtual = Math.max(0, defensor.hpAtual - resultado.dano);
  atualizarHP();

  battleLog.textContent = resultado.critico
    ? `Acerto critico! Causou ${resultado.dano} de dano.`
    : `Causou ${resultado.dano} de dano.`;

  await esperar(900);
}

async function ataqueJogador(evento) {
  if (turnoBloqueado || batalhaTerminou) return;

  turnoBloqueado = true;
  bloquearBotoes(true);

  const ataqueIndex = Number(evento.currentTarget.dataset.attack);
  const ataque = jogador.ataques[ataqueIndex];

  await usarAtaque(jogador, inimigo, ataque, playerImg, enemyImg);

  if (inimigo.hpAtual <= 0) {
    vencerBatalha();
    return;
  }

  await ataqueInimigo();

  if (!batalhaTerminou) {
    turnoBloqueado = false;
    bloquearBotoes(false);
  }
}

async function ataqueInimigo() {
  const ataque = inimigo.ataques[numeroAleatorio(0, inimigo.ataques.length - 1)];

  await usarAtaque(inimigo, jogador, ataque, enemyImg, playerImg);

  if (jogador.hpAtual <= 0) {
    await trocarPokemon();
  }
}

async function trocarPokemon() {
  battleLog.textContent = `${jogador.nome} nao pode mais lutar!`;
  await esperar(900);

  playerAtual++;

  if (playerAtual >= meuTime.length) {
    perderBatalha();
    return;
  }

  try {
    battleLog.textContent = "Chamando o proximo Pokemon...";

    const dadosProximo = await buscarPokemon(meuTime[playerAtual].id);
    jogador = criarLutador(dadosProximo, true);

    playerImg.src = jogador.sprite;
    playerName.textContent = jogador.nome;
    playerLevel.textContent = `Lv. ${jogador.nivel}`;

    configurarBotoesAtaque();
    atualizarHP();

    battleLog.textContent = `Vai, ${jogador.nome}!`;
    await esperar(900);
  } catch (erro) {
    battleLog.textContent = "Erro ao trocar Pokemon.";
    console.error(erro);
  }
}

function vencerBatalha() {
  batalhaTerminou = true;
  battleLog.textContent = `Voce venceu! ${inimigo.nome} foi derrotado.`;
  finalizarBatalha();
}

function perderBatalha() {
  batalhaTerminou = true;
  battleLog.textContent = "Voce perdeu! Seu time inteiro foi derrotado.";
  finalizarBatalha();
}

function finalizarBatalha() {
  bloquearBotoes(true);
  restartBtn.hidden = false;
}

attackButtons.forEach(botao => {
  botao.addEventListener("click", ataqueJogador);
});

restartBtn.addEventListener("click", () => {
  window.location.reload();
});

iniciarBatalha();