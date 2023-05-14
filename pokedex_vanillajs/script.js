
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
  renderedPokeList = fullPokeList.filter(poke => {
    return poke.type == $("#pokeTypes").val();
  });
  renderPokeList();
});

$('#pokeDetailsModal').on('show.bs.modal', function (event) {
  const id = $(event.relatedTarget).data('val');
  const poke = renderedPokeList[id];
  const pokeDescr = `Name: ${poke.name}; Weight: ${poke.weight}; Height: ${poke.height}; Type: ${poke.type};`
  $(this).find(".modal-body").text(pokeDescr);
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
      height: pokeDetails.height,
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

  for(let i = 0; i < renderedPokeList.length; i++){
    const poke = renderedPokeList[i];
    html += `<div class="row" id="${i}">
                <div class="col">${poke.name}</div>
                <div class="col">                
                  <button type="button" class="btn btn-link" data-bs-toggle="modal" data-bs-target="#pokeDetailsModal" data-val="${i}">
                    details
                  </button>                
                </div>
            </div>`;
  }

  $("#list").html(html);
  $("#totalNum").html(`Total number: ${renderedPokeList.length}`);
}

function showDetails(pokeId){
  alert("show details for: " + pokeId);
}
