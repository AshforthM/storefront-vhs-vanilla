import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { ref as databaseRef, push, set, get, update } from "firebase/database";
import { db, storage } from "./libs/firebase/firebaseConfig";

const updateForm = document.forms["updateForm"];

async function init() {
  const key = sessionStorage.getItem("key");
  //console.log(key);
  const productRef = databaseRef(db, `items/${key}`);
  const productSnapshot = await get(productRef);

  if (productSnapshot.exists) {
    setFieldValues(productSnapshot.val());
  }

  updateForm.addEventListener("submit", onUpdateItem);
  document
    .querySelector("#itemImage")
    .addEventListener("change", onImageSelect);
}

function setFieldValues({ urlPath, productName, price, blurb }) {
  updateForm.elements["itemName"].value = productName;
  updateForm.elements["itemPrice"].value = price;
  updateForm.elements["itemBlurb"].value = blurb;
  document.querySelector("#uploadImage").src = urlPath;
}

function onUpdateItem(e) {
  e.preventDefault();
  uploadUpdatedItem();
}

function onImageSelect(e) {
  //selected file
  let file = e.target.files[0];
  //console.log(file);
  //update display with requested img
  document.querySelector(".image-display img").src = URL.createObjectURL(file);
}

async function uploadImageTest(file) {
  //path to firebase img
  const imageRef = storageRef(storage, file.name);
  //pass file to DB
  const confirmation = await uploadBytes(imageRef, file);
  console.log(confirmation);
}

async function uploadUpdatedItem() {
  //form data
  const productName = document.querySelector("#itemName").value.trim();
  const price = document.querySelector("#itemPrice").value.trim();
  const blurb = document.querySelector("#itemBlurb").value.trim();
  const file = document.querySelector("#itemImage").files;

  const key = sessionStorage.getItem("key");
  const productRef = databaseRef(db, `items/${key}`);

  if (file.length !== 0) {
    //paths to DB
    const imageRef = storageRef(storage, `images/${file[0].name}`);
    console.log(imageRef)

    //upload file to firebase storage
    const uploadResult = await uploadBytes(imageRef, file[0]);
    //url to image stored in firebase storage
    const urlPath = await getDownloadURL(imageRef);
    //path to storage to the image
    const storagePath = uploadResult.metadata.fullPath;

    update(productRef, {
      urlPath,
      storagePath,
      productName,
      price: parseFloat(price),
      blurb,
    });
  }
  else{
    update(productRef, {
      productName,
      price: parseFloat(price),
      blurb,
    });
  }

  window.location.assign("index.html");
}

init();
