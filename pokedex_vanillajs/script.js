window.addEventListener("load", fetchAll, false);

async function fetchAll() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10");
  const body = await response.json();
  const pokeArray = body.results;

  const app = document.querySelector("#app");

  let html = "";

  pokeArray.forEach (poke => {
    html += `<div class="wizard">
              <p>${poke.name} - ${poke.url}</p>
          </div>`;
  });

  app.innerHTML = html;

  console.log(jsonData);
}
