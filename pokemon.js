const MAX_POKEMON = 151;
const listWrapper = document.querySelector(".list-wrapper");
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message");

let allPokemons = [];
let visiblePokemons = [];

sessionStorage.setItem("contexto_navegacao", "lista");

iniciarPokedex();

async function iniciarPokedex() {
  try {
    mostrarCarregando("Carregando Pokemon...");

    const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`);
    const data = await resposta.json();

    allPokemons = await Promise.all(
      data.results.map(async (pokemon) => {
        const id = pokemon.url.split("/").filter(Boolean).pop();
        const namePT = await buscarNomePortugues(id, pokemon.name);

        return {
          id,
          name: pokemon.name,
          namePT
        };
      })
    );

    aplicarFiltros();
  } catch (error) {
    console.error("Erro ao carregar Pokedex:", error);
    mostrarCarregando("Nao foi possivel carregar a Pokedex.");
  }
}

async function buscarNomePortugues(id, nomePadrao) {
  try {
    const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    const species = await resposta.json();
    const ptName = species.names.find((name) => name.language.name === "pt");

    return ptName ? ptName.name : formatarNome(nomePadrao);
  } catch {
    return formatarNome(nomePadrao);
  }
}

function formatarNome(nome) {
  return nome
    .split("-")
    .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
    .join(" ");
}

function mostrarCarregando(texto) {
  listWrapper.innerHTML = `<p class="loading-card">${texto}</p>`;
  notFoundMessage.hidden = true;
}

function displayPokemons(pokemonList) {
  listWrapper.innerHTML = "";

  const fragment = document.createDocumentFragment();

  pokemonList.forEach((pokemon) => {
    const listItem = document.createElement("article");
    listItem.className = "list-item";
    listItem.tabIndex = 0;
    listItem.setAttribute("role", "button");
    listItem.setAttribute("aria-label", `Ver detalhes de ${pokemon.namePT}`);

    listItem.innerHTML = `
      <div class="number-wrap">#${String(pokemon.id).padStart(3, "0")}</div>
      <div class="img-wrap">
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png"
          alt="${pokemon.namePT}"
          loading="lazy"
        >
      </div>
      <div class="name-wrap">${pokemon.namePT}</div>
    `;

    const abrirDetalhe = () => {
      window.location.href = `./detail.html?id=${pokemon.id}`;
    };

    listItem.addEventListener("click", abrirDetalhe);
    listItem.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        abrirDetalhe();
      }
    });

    fragment.appendChild(listItem);
  });

  listWrapper.appendChild(fragment);
}

function aplicarFiltros() {
  const termo = searchInput.value.trim().toLowerCase();

  visiblePokemons = allPokemons.filter((pokemon) => {
    if (!termo) return true;

    if (numberFilter.checked) {
      return pokemon.id.startsWith(termo.replace("#", ""));
    }

    return pokemon.namePT.toLowerCase().includes(termo)
      || pokemon.name.toLowerCase().includes(termo);
  });

  visiblePokemons.sort((a, b) => {
    if (nameFilter.checked) {
      return a.namePT.localeCompare(b.namePT, "pt-BR");
    }

    return Number(a.id) - Number(b.id);
  });

  displayPokemons(visiblePokemons);
  notFoundMessage.hidden = visiblePokemons.length !== 0;
}

function clearSearch() {
  searchInput.value = "";
  aplicarFiltros();
}

searchInput.addEventListener("input", aplicarFiltros);
numberFilter.addEventListener("change", aplicarFiltros);
nameFilter.addEventListener("change", aplicarFiltros);

window.pokedexList = {
  aplicarFiltros,
  clearSearch
};
