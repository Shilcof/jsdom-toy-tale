let addToy = false;

const toyArea = document.querySelector("#toy-collection");
const textInput = document.querySelectorAll(".add-toy-form input.input-text")[0];
const imageInput = document.querySelectorAll(".add-toy-form input.input-text")[1];

class Toy {
  constructor(obj) {
    this.id = obj.id;
    this.name = obj.name;
    this.image = obj.image;
    this.likes = obj.likes;
  }
  
  renderToy() {
    let toyDiv = document.querySelector(`#toy_${this.id}`);
    if (toyDiv === null) {
      toyDiv = document.createElement('div');
      toyDiv.classList.add(`card`);
      toyDiv.id = `toy_${this.id}`;
      toyArea.appendChild(toyDiv);
    }
    toyDiv.innerHTML = `
    <h2>${this.name}</h2>
    <img src="${this.image}" class="toy-avatar">
    <p class"likes">${this.likes} likes </p>
    <button class="like-button">Like <3</button>
    `
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const createButton = document.querySelector(".add-toy-form input.submit");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  createButton.addEventListener("click", handleCreate);

  toyArea.addEventListener("click", likeToy)

  fetch("http://localhost:3000/toys")
    .then(resp=>resp.json())
    .then(renderToysFromJSON)
});

function renderToysFromJSON(toyJSON) {
  const toyObjects = toyJSON.map(info=>new Toy(info));
  toyObjects.forEach(toy => toy.renderToy());
}

function renderToy(info) {
  const newToy = new Toy(info);
  newToy.renderToy();
}

function handleCreate(event) {
  event.preventDefault();
  const confObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      "name": textInput.value,
      "image": imageInput.value,
      "likes": 0
    })
  }
  fetch("http://localhost:3000/toys", confObj)
    .then(resp=>resp.json())
    .then(renderToy)
}

function likeToy(e) {
  if (e.target.innerText === "Like <3"){
    const confObj = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        "likes": parseInt(e.target.parentElement.querySelector("p").innerText.split(" ")[0]) + 1
      })
    }
    fetch(`http://localhost:3000/toys/${e.target.parentElement.id.split("_")[1]}`, confObj)
      .then(resp=>resp.json())
      .then(renderToy)
  }
}