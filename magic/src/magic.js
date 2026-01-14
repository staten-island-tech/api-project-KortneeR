import './style.css'

const URL = "https://api.magicthegathering.io/v1/cards";
let allCardsWithImages = []; //so i can use it everywhere

async function getData(URL) { //prints out all the cards with images in the console when inspecting
  try {
    const response = await fetch(URL);
    if (response.status != 200) {
      throw new Error(response);
    } else {
      const data = await response.json();
      const cards = data.cards; 
      const cardsWithImages = cards.filter(card => card.imageUrl);

      allCardsWithImages = cardsWithImages;

      cardsWithImages.forEach(inject);
      addToCollection();
    }
  } catch (error) {
    console.log(error);
    console.log("不好");
  }
}
getData(URL);


function inject(card) { //injects all cards (with images) onto the screen with a pretty bolding and border and wtv 
  document.querySelector('#container').insertAdjacentHTML(
    "afterbegin",
    `
    <div class="p-4 border rounded-xl shadow-md flex flex-col items-center gap-2">

      <h3 class="font-bold text-center">${card.name}</h3>

      <h5 class="text-sm text-gray-500">${card.rarity}</h5>

      <img src="${card.imageUrl}" class="w-40 h-56 object-cover rounded-lg">

      <h4 class="text-xs">Artist: ${card.artist}</h4>

      <button class="bg-blue-500 text-white px-3 py-1 rounded">
        Add to Collection
      </button>
    
      </div>
    `
  );
}

function addToCollection() { //counter on nav bar that updates whenever a card is "owned"
  const counter = document.querySelector('#counter'); //selecting the space in the html for the id "counter"
  let collectedCount = 0; //count starts at 0
  const clickedButtons = new Set(); //whena button is clicked it begins a unique list with clicked buttons 

  const buttons = document.querySelectorAll('#container button'); //"buttons" are equal to all the buttons in the section with the id "container"

  buttons.forEach(button => { //look through all the buttons
    button.addEventListener('click', () => { //listen if the userr has clicked one of the "Add to Collection" buttons
      if (clickedButtons.has(button)) return; //if it's been clicked theeeeeen

      clickedButtons.add(button);
      collectedCount++; //count increases by 1
      counter.textContent = `${collectedCount} out of 68 Collected`; //whatever that count was taken replaces the 0 that "collectedCount" used to be
      button.textContent = "Owned";  //the button becomes "Owned" to display to the user that they have this card already
      button.classList.add('bg-gray-400', 'cursor-not-allowed'); //for speciaaal effeeeects it becomes grayed out and not clickable so the user cant js spam the counter
    });
  });
}

function normalizeString(str) { //bc i found out the api for motg is crappy and has random symbols, all those random spaces and stuff and no capitalization in the searchbar will be ignored and replaced and what not
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

const searchInput = document.querySelector('input[placeholder="Search"]'); //"searchInput" is equal to that search thing i put in html from daisy ducky

searchInput.addEventListener('keydown', (e) => { //listen to when the enter/return key is pressed
  if (e.key === 'Enter') { //when it's pressed
    e.preventDefault(); //prevent the page from reloading or smth

    const searchValue = searchInput.value; // "search value" is equal to what ya js typed
    const filteredCards = allCardsWithImages.filter(card => //go through all the cards in the array
      normalizeString(card.name).includes(normalizeString(searchValue)) //the normalized name (the normalized not what it was before, yk to prevent error) matches the normalized search thing u put in 
    );

    const container = document.querySelector('#container'); //select the container holding all ya cards
    container.innerHTML = ''; //delete everything inside the container (so we can show the new stuff)
    filteredCards.forEach(inject); //inject in the neeeeew stuff 
    addToCollection(); //so that the user can still use the "Add to Collection" button even after i js filtered out everything yk
  }
});
