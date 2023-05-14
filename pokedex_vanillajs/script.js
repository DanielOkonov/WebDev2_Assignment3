
let fullPokeList = [];
let renderedPokeList = [];
let pokeTypes = [];

$("#load").on("click", async function () {
  $(".spinner-border").show();

  fullPokeList = await loadAllPokes();
  renderedPokeList = fullPokeList;
  pokeTypes = await loadPokeTypes();

  $.each(pokeTypes, function (i, pt) {
    $("#pokeTypes").append($("<option></option>").val(pt).html(pt));
  });

  renderPokeList();

  $(".spinner-border").hide();
});

$("#pokeTypes").on("change", function () {
  alert("Type selected: " + $("#pokeTypes").val());
});

async function loadAllPokes() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100");
  const body = await response.json();
  const pokeArray = body.results;

  let result = [];

  for (const poke of pokeArray) {
    const response = await fetch(poke.url);
    const pokeDetails = await response.json();

    result.push({
      name: pokeDetails.name,
      weight: pokeDetails.weight,
      // get first type from types
      type: pokeDetails.types[0].type.name,
    });
  }
  return result;
}

async function loadPokeTypes() {
  const response = await fetch("https://pokeapi.co/api/v2/type/");
  const body = await response.json();
  const pokeTypes = body.results;

  let result = [];

  for (const pokeType of pokeTypes) {
    result.push(pokeType.name);
  }
  return result;
}

function renderPokeList() {
  let html = "";

  renderedPokeList.forEach((poke) => {
    html += `<div>
                <p>${poke.name} - ${poke.weight} - ${poke.type} </p>
            </div>`;
  });

  $("#list").html(html);
}
