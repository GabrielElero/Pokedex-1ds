// Função que gera a URL de cada Pokémon
const getPokemonUrl = idOrName => `https://pokeapi.co/api/v2/pokemon/${idOrName}`

// Cria um array de Promises para buscar os 151 primeiros Pokémon
const generatePokemonPromises = () =>
  Array(151).fill().map((_, index) =>
    fetch(getPokemonUrl(index + 1)).then(response => response.json())
  )

// Gera o HTML para cada Pokémon
const generateHTML = pokemons => {
  return pokemons.reduce((accumulator, { name, id, types }) => {
    const elementTypes = types.map(typeInfo => typeInfo.type.name)

    accumulator += `
      <li class="card ${elementTypes[0]}">
        <img class="card-image" alt="${name}" 
             src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png" />
        <h2 class="card-title">${id}. ${name}</h2>
        <p class="card-subtitle">${elementTypes.join(" | ")}</p>
      </li>
    `
    return accumulator
  }, "")
}

// Insere os Pokémon na página
const insertPokemonsIntoPage = pokemons => {
  const ul = document.querySelector('[data-js="pokedex"]')
  ul.innerHTML = pokemons
}

// Executa tudo para carregar os 151 Pokémon
const pokemonPromises = generatePokemonPromises()

Promise.all(pokemonPromises)
  .then(generateHTML)
  .then(insertPokemonsIntoPage)

// -----------------------------
// 🔎 Funcionalidade de busca
// -----------------------------
const searchForm = document.querySelector('[data-js="search-form"]')
const searchInput = document.querySelector('[data-js="search"]')

searchForm.addEventListener("submit", event => {
  event.preventDefault()
  const query = searchInput.value.trim().toLowerCase()

  if (!query) return

  fetch(getPokemonUrl(query))
    .then(response => {
      if (!response.ok) throw new Error("Pokémon não encontrado")
      return response.json()
    })
    .then(pokemon => {
      const html = generateHTML([pokemon])
      insertPokemonsIntoPage(html)
    })
    .catch(error => {
      insertPokemonsIntoPage(`<li class="card error">❌ ${error.message}</li>`)
    })
})
