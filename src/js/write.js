import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import {ref as databaseRef, push, set, get} from 'firebase/database'
import { db, storage  } from "./libs/firebase/firebaseConfig";

document.forms["addForm"].addEventListener("submit", onAddItem);
document.querySelector("#itemImage").addEventListener("change", onImageSelect);

function onAddItem(e){
    e.preventDefault();
    uploadNewItem();
}

function onImageSelect(e){
    //selected file
    let file = e.target.files[0];
    console.log(file);
    //update display with requested img
    document.querySelector(".image-display img").src = URL.createObjectURL(file);
}

async function uploadImageTest(file){
    //path to firebase img
    const imageRef = storageRef(storage, file.name);
    //pass file to DB
    const confirmation = await uploadBytes(imageRef, file);
    console.log(confirmation);
}

async function uploadNewItem(){
    //form data
    const productName = document.querySelector('#itemName').value.trim();
    const price = document.querySelector('#itemPrice').value.trim();
    const rating = document.querySelector('#itemRating').value.trim();
    const numberOfTapes = document.querySelector('#itemNumber').value.trim();
    const file = document.querySelector('#itemImage').files[0];

    //paths to DB
    const imageRef = storageRef(storage, `images/${file.name}`);
    const dataRef = databaseRef(db, 'items');

    //upload file to firebase storage
    const uploadResult = await uploadBytes(imageRef, file);
    //url to image stored in firebase storage
    const urlPath = await getDownloadURL(imageRef);
    //path to storage to the image
    const storagePath = uploadResult.metadata.fullPath;

    //firebase unique key
    const itemRef = await push(dataRef);

    set(itemRef,{
        key:itemRef.key,
        sku: `vhs${itemRef.key}`,        
        urlPath,
        storagePath,
        productName,
        price: parseFloat(price),
        rating,
        numberOfTapes: parseInt(numberOfTapes)
    })
}