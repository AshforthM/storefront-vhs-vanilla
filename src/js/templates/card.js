import { ref as dataRef, get, set, update, remove } from "firebase/database";
import { db } from "../libs/firebase/firebaseConfig";

export default function renderCard({urlPath, key, productName, price, blurb}) {
  const template = `
    <li class="card">
    <img src="${urlPath}" />
    <ul class="card-options">
      <li><i class="fa-solid fa-pencil" id="update" data-key="${key}"></i></li>
      <li><i id="delete" data-key="${key}" class="fa-solid fa-trash"></i></li>
    </ul>
    <div class="product-details">
      <span class="product-name">${productName}</span>
      <span class="price">${price}</span>
      <span class="reviews">${blurb}</span>
      <button class="btn-buy">Buy Now</button>          
    </div>            
  </li>
    `;

  const element = document.createRange().createContextualFragment(template)
    .children[0];

  addButtonControls(element);

  return element;
}

function addButtonControls(card) {
  card.querySelector("#update").addEventListener("click", onUpdateProduct);
  card.querySelector("#delete").addEventListener("click", onDeleteproduct);
}

function onUpdateProduct(e) {
  e.preventDefault();
  const key = e.target.dataset.key;
  sessionStorage.setItem("key", key);
  window.location.assign("update.html");
}

function onDeleteproduct(e) {
  e.preventDefault();
  const key = e.target.dataset.key;
  const productRef = dataRef(db, `items/${key}`);
  remove(productRef);
  window.location.assign("index.html");
}
