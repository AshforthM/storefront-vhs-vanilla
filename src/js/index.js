import { ref as dataRef, get, set, update } from "firebase/database";
import { db } from "./libs/firebase/firebaseConfig";
import renderCard from "./templates/card";

//console.log(db);

async function init() {
  const cardList = document.getElementById("cardList");
  const dbRef = dataRef(db, "items/");
  const dbSnapshot = await get(dbRef);
  const data = {...dbSnapshot.val()};
  //console.log(data)
  Object.values(data).map((product) => {
    const card = renderCard(product);
    cardList.append(card);
    //console.log(product);
  });
}

init();
