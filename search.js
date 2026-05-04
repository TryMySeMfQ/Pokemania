const inputElement = document.querySelector("#search-input");
const closeIcon = document.querySelector("#search-close-icon");
const sortWrapper = document.querySelector(".sort-wrapper");
const sortButton = document.querySelector(".sort-wrap");
const filterWrapper = document.querySelector(".filter-wrapper");

inputElement.addEventListener("input", handleInputChange);
closeIcon.addEventListener("click", handleSearchCloseOnClick);
sortButton.addEventListener("click", handleSortIconOnClick);

document.addEventListener("click", (event) => {
  if (!sortWrapper.contains(event.target)) {
    fecharFiltro();
  }
});

filterWrapper.addEventListener("click", (event) => {
  event.stopPropagation();
});

function handleInputChange() {
  closeIcon.classList.toggle("search-close-icon-visible", inputElement.value !== "");
}

function handleSearchCloseOnClick() {
  inputElement.value = "";
  closeIcon.classList.remove("search-close-icon-visible");
  window.pokedexList?.clearSearch();
  inputElement.focus();
}

function handleSortIconOnClick(event) {
  event.stopPropagation();
  const aberto = filterWrapper.classList.toggle("filter-wrapper-open");
  sortButton.setAttribute("aria-expanded", String(aberto));
}

function fecharFiltro() {
  filterWrapper.classList.remove("filter-wrapper-open");
  sortButton.setAttribute("aria-expanded", "false");
}
