# Pokemania com Batalha Pokemon

Projeto web feito com HTML, CSS e JavaScript puro. Ele usa a PokeAPI para listar Pokemon, mostrar detalhes, montar um time com 3 Pokemon e iniciar uma batalha simples contra um Pokemon selvagem.

## Funcionalidades

- Menu inicial com acesso para a Pokemania e para a batalha.
- Lista com os 151 primeiros Pokemon.
- Busca por numero ou nome.
- Ordenacao por numero ou nome.
- Tela de detalhes com imagem, tipo, peso, altura, habilidades, descricao e status base.
- Navegacao entre Pokemon na tela de detalhes.
- Selecao de 3 Pokemon para montar um time.
- Batalha por turnos contra um Pokemon aleatorio.
- Ataques com dano variavel, chance de erro e golpe critico.
- Troca automatica quando um Pokemon do jogador e derrotado.
- Tela responsiva para celular, tablet e desktop.

## Como Executar

Abra o arquivo `index.html` no navegador.

Fluxo recomendado:

1. Abra `index.html`.
2. Clique em `Ver Pokemania` para consultar os Pokemon.
3. Clique em `Batalha` para montar seu trio.
4. Selecione 3 Pokemon.
5. Clique em `Entrar na arena`.

Como o projeto usa `fetch` para acessar a PokeAPI, e recomendado estar conectado a internet.

## Estrutura do Projeto

```text
.
├── index.html
├── menu.css
├── list.html
├── style.css
├── pokemon.js
├── search.js
├── detail.html
├── detail.css
├── pokemon-detail.js
├── selecao.html
├── selecao.css
├── selecao.js
├── battle.html
├── battle.css
├── battle.js
└── assets/
```

## Arquivos Principais

### `index.html`

Tela inicial do projeto. Mostra o menu principal com os botoes para acessar a Pokemania ou a selecao de batalha.

### `list.html`

Tela da Pokemania. Mostra a lista dos Pokemon e permite buscar, ordenar e abrir a tela de detalhes.

### `pokemon.js`

Carrega os Pokemon da PokeAPI, renderiza os cards da lista, aplica busca e ordenacao.

### `search.js`

Controla a interface da busca, o botao de limpar texto e o menu de ordenacao.

### `detail.html`

Tela de detalhes de um Pokemon especifico.

### `pokemon-detail.js`

Busca os dados completos do Pokemon selecionado, exibe tipos, imagem, descricao, habilidades e status.

### `selecao.html`

Tela para escolher os 3 Pokemon que serao usados na batalha.

### `selecao.js`

Controla a selecao do time, salva os Pokemon escolhidos no `localStorage` e libera o botao de batalha quando o trio esta completo.

### `battle.html`

Tela da batalha Pokemon.

### `battle.js`

Controla a batalha por turnos, vida dos Pokemon, ataques, dano, critico, erro, vitoria, derrota e troca automatica do Pokemon derrotado.

## Tecnologias Usadas

- HTML5
- CSS3
- JavaScript
- PokeAPI
- LocalStorage

## API Usada

Este projeto usa a PokeAPI:

```text
https://pokeapi.co/
```

Exemplos de endpoints usados:

```text
https://pokeapi.co/api/v2/pokemon?limit=151
https://pokeapi.co/api/v2/pokemon/{id}
https://pokeapi.co/api/v2/pokemon-species/{id}
```

## Responsividade

O layout foi ajustado para funcionar bem em:

- Celulares
- Tablets
- Desktops

As telas usam grid, medidas flexiveis, `clamp()`, `minmax()` e media queries para adaptar cards, botoes, cabecalhos e imagens.

## Dados Salvos no Navegador

O time escolhido e salvo no `localStorage` com a chave:

```text
meuTime
```

Exemplo:

```json
[
  { "id": "1", "name": "Bulbasaur" },
  { "id": "4", "name": "Charmander" },
  { "id": "7", "name": "Squirtle" }
]
```

## Possiveis Melhorias Futuras

- Adicionar sistema de tipos com vantagem e desvantagem.
- Adicionar experiencia e subida de nivel.
- Permitir escolher ataques manualmente antes da batalha.
- Criar sons e musica de batalha.
- Adicionar animacoes mais parecidas com os jogos classicos.
- Salvar historico de vitorias e derrotas.
- Adicionar mais geracoes de Pokemon.

## Observacao

Este projeto e educativo e foi construido para praticar consumo de API, manipulacao do DOM, responsividade e logica basica de batalha em JavaScript.
