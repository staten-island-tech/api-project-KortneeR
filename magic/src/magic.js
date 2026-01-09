import './style.css'

const URL = "https://api.magicthegathering.io/v1/cards";

async function getData(URL) {
  try {
    const response = await fetch(URL);
    if (response.status != 200) {
      throw new Error(response);
    } else {
      const data = await response.json(); 
      console.log(data.cards.map(card => card.name));
      document.getElementById("api-response").textContent = data.name;
    }
  } catch (error) {
    console.log(error);
    console.log("不好");
  }
}
getData(URL);

function inject(card){
document.querySelector('#container').insertAdjacentHTML(
  "afterbegin",
  `<div>
  <h3>${card.name}</h3>
  <h5>${card.rarity}</h5>
  <img src = ${card.imageUrl}>
  <h4>Artist:${card.artist}</h4>
  <button id="toCollection">Add to Collection</button>
  </div>`
);
}

cards.forEach(inject(card));

let cardsTotal = 0;

