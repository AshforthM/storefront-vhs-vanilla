import { ref as dataRef, get, set, update } from "firebase/database";
import { db } from "./libs/firebase/firebaseConfig";

//console.log(db);

async function init(){
    const dbRef = dataRef(db, 'items/');
    const dbSnapshot = await get(dbRef);
    const data = dbSnapshot.val();
    console.log(data);
}

//DELETE

function deleteItem(){

}

init();