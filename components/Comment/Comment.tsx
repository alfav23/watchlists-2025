
// using this to redo app v0, not a comments component right now

import { db } from "@/lib/firebaseConfig";
import { getAuth } from "firebase/auth";
import { addDoc, collection, doc } from "firebase/firestore";


// set current user
const auth = getAuth();
const user = auth.currentUser; 

// create= addDoc
const collectionRef = collection(db, "watchlists");
const createWatchlist = addDoc(collectionRef, {
    title: "test",
    user: user?.displayName
})

console.log("nice, you made a list, ", user?.displayName)

// display = map



// edit= updateDoc

// delete - deleteDoc