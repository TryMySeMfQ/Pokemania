const MAX_POKEMONS = 151;
let currentPokemonId = getPokemonIdFromUrl();

const typeColors = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC"
};

const typeTranslation = {
  normal: "Normal",
  fire: "Fogo",
  water: "Agua",
  electric: "Eletrico",
  grass: "Planta",
  ice: "Gelo",
  fighting: "Lutador",
  poison: "Veneno",
  ground: "Terra",
  flying: "Voador",
  psychic: "Psiquico",
  bug: "Inseto",
  rock: "Pedra",
  ghost: "Fantasma",
  dragon: "Dragao",
  dark: "Sombrio",
  steel: "Aco",
  fairy: "Fada"
};

const statTranslation = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SATK",
  "special-defense": "SDEF",
  speed: "VEL"
};

document.addEventListener("DOMContentLoaded", () => {
  if (!currentPokemonId) {
    mostrarErro();
    return;
  }

  document.getElementById("leftArrow").addEventListener("click", () => {
    navegarPokemon(currentPokemonId - 1);
  });

  document.getElementById("rightArrow").addEventListener("click", () => {
    navegarPokemon(currentPokemonId + 1);
  });

  loadPokemon(currentPokemonId);
});

function getPokemonIdFromUrl() {
  const pokemonID = new URLSearchParams(window.location.search).get("id");
  const id = Number(pokemonID);

  if (!Number.isInteger(id) || id < 1 || id > MAX_POKEMONS) {
    return null;
  }

  return id;
}

async function loadPokemon(id) {
  try {
    setLoadingState(true);

    const [pokemon, species] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json()),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) => res.json())
    ]);

    currentPokemonId = id;
    displayPokemonDetails(pokemon, species);
    window.history.pushState({}, "", `./detail.html?id=${id}`);
  } catch (error) {
    console.error("Erro ao buscar dados do Pokemon:", error);
    mostrarErro();
  } finally {
    setLoadingState(false);
  }
}

function setLoadingState(isLoading) {
  const name = document.querySelector(".name");

  if (isLoading) {
    name.textContent = "Carregando...";
  }

  document.getElementById("leftArrow").disabled = isLoading || currentPokemonId <= 1;
  document.getElementById("rightArrow").disabled = isLoading || currentPokemonId >= MAX_POKEMONS;
}

function navegarPokemon(id) {
  if (id < 1 || id > MAX_POKEMONS || id === currentPokemonId) return;
  loadPokemon(id);
}

function mostrarErro() {
  document.querySelector(".detail-main").innerHTML = `
    <section class="error-card">
      <h1>Pokemon nao encontrado</h1>
      <p>Escolha outro Pokemon na lista ou monte um time para batalha.</p>
      <div class="error-actions">
        <a href="./list.html">Voltar para lista</a>
        <a href="./selecao.html">Montar time</a>
      </div>
    </section>
  `;
}

function formatarNome(nome) {
  return nome
    .split("-")
    .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
    .join(" ");
}

function getPokemonName(pokemon, species) {
  const ptName = species.names.find((name) => name.language.name === "pt");
  return ptName ? ptName.name : formatarNome(pokemon.name);
}

function getFlavorText(species) {
  const pt = species.flavor_text_entries.find((entry) => entry.language.name === "pt");
  const en = species.flavor_text_entries.find((entry) => entry.language.name === "en");
  const entry = pt || en;

  return entry ? entry.flavor_text.replace(/\f|\n/g, " ") : "Descricao indisponivel.";
}

function displayPokemonDetails(pokemon, species) {
  const name = getPokemonName(pokemon, species);
  const mainType = pokemon.types[0].type.name;
  const color = typeColors[mainType] || "#d9272e";

  document.title = `${name} | Pokedex`;
  document.querySelector(".name").textContent = name;
  document.querySelector(".pokemon-id-wrap").textContent = `#${String(pokemon.id).padStart(3, "0")}`;
  document.querySelector(".detail-main").style.setProperty("--pokemon-color", color);

  const image = document.querySelector(".detail-img-wrapper img");
  image.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
  image.alt = name;

  renderTypes(pokemon.types);
  renderAbout(pokemon);
  renderStats(pokemon.stats);

  document.querySelector(".pokemon-description").textContent = getFlavorText(species);
  document.getElementById("leftArrow").disabled = pokemon.id <= 1;
  document.getElementById("rightArrow").disabled = pokemon.id >= MAX_POKEMONS;
}

function renderTypes(types) {
  const typeWrapper = document.querySelector(".power-wrapper");
  typeWrapper.innerHTML = "";

  types.forEach(({ type }) => {
    const item = document.createElement("p");
    item.className = "type";
    item.textContent = typeTranslation[type.name] || formatarNome(type.name);
    item.style.backgroundColor = typeColors[type.name] || "#6b7280";
    typeWrapper.appendChild(item);
  });
}

function renderAbout(pokemon) {
  document.querySelector(".weight").textContent = `${pokemon.weight / 10} kg`;
  document.querySelector(".height").textContent = `${pokemon.height / 10} m`;

  const abilityWrapper = document.querySelector(".move");
  abilityWrapper.innerHTML = "";

  pokemon.abilities.slice(0, 2).forEach(({ ability }) => {
    const abilityText = document.createElement("p");
    abilityText.textContent = formatarNome(ability.name);
    abilityWrapper.appendChild(abilityText);
  });
}

function renderStats(stats) {
  const statsWrapper = document.querySelector(".stats-wrapper");
  statsWrapper.innerHTML = "";

  stats.forEach(({ stat, base_stat }) => {
    const statDiv = document.createElement("div");
    statDiv.className = "stats-wrap";

    statDiv.innerHTML = `
      <div class="stats-top">
        <p class="stats">${statTranslation[stat.name] || stat.name.toUpperCase()}</p>
        <p class="stat-value">${base_stat}</p>
      </div>
      <progress value="${base_stat}" max="180" class="progress-bar"></progress>
    `;

    statsWrapper.appendChild(statDiv);
  });
}
