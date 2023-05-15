
let fullPokeList = [];
let filteredPokeList = [];
let pokeTypes = [];
let currentPageId = 0;

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
  fillPagination();
  renderPagination(0);

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
  fillPagination();
  renderPagination(0);
});

$("#pageSize").on("change", function () {
  renderPage(0);
  fillPagination();
  renderPagination(0);
});

$(".pagination").click(function(event){
  event.stopPropagation();
  const liId = event.target.parentElement.id;
  
  let pageId = 0;
  if(liId === 'prev'){
    if(currentPageId === 0)
      return;
    pageId = currentPageId - 1;
  } else if(liId === 'next'){
    if(currentPageId === filteredPokeList.length - 1)
      return;
    pageId = currentPageId + 1;
  } else {
    pageId = parseInt(liId);
  }

  renderPage(pageId);
  renderPagination(pageId);
});

$('#pokeDetailsModal').on('show.bs.modal', function (event) {
  const name = $(event.relatedTarget).data('val');
  const poke = filteredPokeList.find(poke => poke.name === name);
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
                  <button type="button" class="btn btn-link" data-bs-toggle="modal" data-bs-target="#pokeDetailsModal" data-val="${poke.name}">
                    details
                  </button>                
                </div>
            </div>`;
  }

  $("#list").html(html);  
}

function fillPagination(){
  const pageSize = $('#pageSize').val(); 
  const numOfFiltered = filteredPokeList.length;
  const numOfPages = Math.ceil(numOfFiltered / pageSize);
  $(".pagination").empty();
  $(".pagination").append( "<li class='page-item' id='prev'><a class='page-link' href='#'>Previous</a></li>");
  for(let i = 0; i < numOfPages; i++){
    $(".pagination").append( `<li class='page-item' id='${i}'><a class='page-link' href='#'>${i + 1}</a></li>`);
  }  
  $(".pagination").append( "<li class='page-item' id='next'><a class='page-link' href='#'>Next</a></li>");

  currentPageId = 0;
}

function renderPagination(pageId){
  const numOfButtonToShow = 5;

  const pageSize = $('#pageSize').val(); 
  const numOfFiltered = filteredPokeList.length;
  const numOfPages = Math.ceil(numOfFiltered / pageSize);    

  $(`.pagination > #${currentPageId}`).removeClass('active');
  $(`.pagination > #${pageId}`).addClass('active');

  if(pageId === 0){
    $('.pagination > #prev').addClass('disabled');
  } else {
    $('.pagination > #prev').removeClass('disabled');
  }
  

  currentPageId = pageId;
}

function showDetails(pokeId){
  alert("show details for: " + pokeId);
}
