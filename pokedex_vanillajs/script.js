
let fullPokeList = [];
let filteredPokeList = [];
let pokeTypes = [];

$( document ).ready(async function() {
  $(".spinner-border").show();

  fullPokeList = await loadAllPokes();
  $("#totalNum").html(`Total: ${fullPokeList.length}`);
  filteredPokeList = fullPokeList;
  pokeTypes = await loadPokeTypes();

  $.each(pokeTypes, function (i, pt) {
    $("#pokeTypes").append($("<option></option>").val(pt).html(pt));
  });

  renderPage(0);
  $("#filteredNum").html(`Filtered: ${filteredPokeList.length}`);
  fillPagination($('#pageSize').val(), filteredPokeList.length);

  $(".spinner-border").hide();
});

$("#pokeTypes").on("change", function () {
  if($("#pokeTypes").val() == "_all"){
    filteredPokeList = fullPokeList;
  }
  else{
    filteredPokeList = fullPokeList.filter(poke => {
      return poke.type == $("#pokeTypes").val();
    });
  }

  renderPage(0);
  $("#filteredNum").html(`Filtered: ${filteredPokeList.length}`);
  fillPagination($('#pageSize').val(), filteredPokeList.length);
});

$("#pageSize").on("change", function () {
  renderPage(0);
  fillPagination($('#pageSize').val(), filteredPokeList.length);
});

$('#pokeDetailsModal').on('show.bs.modal', function (event) {
  const id = $(event.relatedTarget).data('val');
  const poke = filteredPokeList[id];
  $(this).find(".modal-title").text(poke.name);
  const pokeDescr = `Weight: ${poke.weight}; Height: ${poke.height}; Type: ${poke.type};`
  $(this).find(".modal-body").text(pokeDescr);
  $(this).find(".modal-image").attr("src", poke.image);
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
      image: pokeDetails.sprites.front_default
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

function renderPage(pageId) {
  const pageSize = $('#pageSize').val();
  let html = "";

  const listToRender = filteredPokeList.slice(pageId * pageSize, (pageId + 1) * pageSize);

  for(let i = 0; i < listToRender.length; i++){
    const poke = listToRender[i];
    html += `<div class="row" id="${i}">
                <div class="col-1"><img src="${poke.image}" style="width:70px;height:70px"></img></div>
                <div class="col-2">${poke.name}</div>
                <div class="col-3">                
                  <button type="button" class="btn btn-link" data-bs-toggle="modal" data-bs-target="#pokeDetailsModal" data-val="${i}">
                    details
                  </button>                
                </div>
            </div>`;
  }

  $("#list").html(html);  
}

function fillPagination(pageSize, numOfFiltered){
  const numOfPages = Math.ceil(numOfFiltered / pageSize);
  $(".pagination").empty();
  $(".pagination").append( "<li class='page-item'><a class='page-link' href='#'>Previous</a></li>");
  for(let i = 0; i < numOfPages; i++){
    $(".pagination").append( `<li class='page-item'><a class='page-link' href='#' id='${i}'>${i + 1}</a></li>`);
  }  
  $(".pagination").append( "<li class='page-item'><a class='page-link' href='#'>Next</a></li>");
}

function showDetails(pokeId){
  alert("show details for: " + pokeId);
}
