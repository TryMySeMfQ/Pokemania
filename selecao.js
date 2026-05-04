const MAX_POKEMON = 151;
const listWrapper = document.querySelector(".list-wrapper");
const btnLutar = document.getElementById("btn-lutar");
const MAX_TIME = 3;

let timeSelecionado = JSON.parse(localStorage.getItem("meuTime")) || [];

carregarPokemons();
atualizarSlots();
atualizarBotao();

async function carregarPokemons() {
  try {
    listWrapper.innerHTML = `<p class="loading-card">Carregando Pokemon...</p>`;

    const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`);
    const data = await resposta.json();

    displayPokemons(data.results);
  } catch (error) {
    console.error("Erro ao carregar selecao:", error);
    listWrapper.innerHTML = `<p class="loading-card">Nao foi possivel carregar os Pokemon.</p>`;
  }
}

function displayPokemons(pokemons) {
  listWrapper.innerHTML = "";

  const fragment = document.createDocumentFragment();

  pokemons.forEach((pokemon) => {
    const pokemonID = pokemon.url.split("/").filter(Boolean).pop();
    const listItem = document.createElement("article");
    const selecionado = timeSelecionado.some((item) => item.id === pokemonID);

    listItem.className = selecionado ? "list-item selected" : "list-item";
    listItem.tabIndex = 0;
    listItem.setAttribute("role", "button");
    listItem.setAttribute("data-id", pokemonID);
    listItem.setAttribute("aria-label", `Selecionar ${pokemon.name}`);

    listItem.innerHTML = `
      <div class="number-wrap">#${String(pokemonID).padStart(3, "0")}</div>
      <div class="img-wrap">
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonID}.png"
          alt="${pokemon.name}"
          loading="lazy"
        >
      </div>
      <div class="name-wrap">${formatarNome(pokemon.name)}</div>
    `;

    const alternarSelecao = () => selecionarPokemon(pokemonID, formatarNome(pokemon.name));

    listItem.addEventListener("click", alternarSelecao);
    listItem.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        alternarSelecao();
      }
    });

    fragment.appendChild(listItem);
  });

  listWrapper.appendChild(fragment);
}

function formatarNome(nome) {
  return nome
    .split("-")
    .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
    .join(" ");
}

function selecionarPokemon(id, name) {
  const index = timeSelecionado.findIndex((pokemon) => pokemon.id === id);

  if (index > -1) {
    timeSelecionado.splice(index, 1);
    removerClasse(id);
  } else {
    if (timeSelecionado.length >= MAX_TIME) {
      alert("Voce so pode escolher 3 Pokemon!");
      return;
    }

    timeSelecionado.push({ id, name });
    adicionarClasse(id);
  }

  atualizarSlots();
  atualizarBotao();
}

function adicionarClasse(id) {
  document.querySelector(`[data-id="${id}"]`)?.classList.add("selected");
}

function removerClasse(id) {
  document.querySelector(`[data-id="${id}"]`)?.classList.remove("selected");
}

function atualizarSlots() {
  for (let i = 1; i <= MAX_TIME; i++) {
    const slot = document.getElementById(`slot-${i}`);
    slot.textContent = "?";
    slot.classList.remove("filled");
  }

  timeSelecionado.forEach((pokemon, index) => {
    const slot = document.getElementById(`slot-${index + 1}`);

    slot.innerHTML = `
      <img
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png"
        alt="${pokemon.name}"
      >
    `;
    slot.classList.add("filled");
  });
}

function atualizarBotao() {
  const timeCompleto = timeSelecionado.length === MAX_TIME;

  btnLutar.disabled = !timeCompleto;
  btnLutar.classList.toggle("disabled", !timeCompleto);

  if (timeSelecionado.length > 0) {
    localStorage.setItem("meuTime", JSON.stringify(timeSelecionado));
  } else {
    localStorage.removeItem("meuTime");
  }
}

btnLutar.addEventListener("click", () => {
  if (timeSelecionado.length === MAX_TIME) {
    window.location.href = "./battle.html";
  }
});
