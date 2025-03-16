import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 



const firebaseConfig = {
    apiKey: "AIzaSyCU4NBngSOqz1b80YttGZPq11sL-kGoSig",
    authDomain: "bizarreadventure-ba84a.firebaseapp.com",
    projectId: "bizarreadventure-ba84a",
    storageBucket: "bizarreadventure-ba84a.appspot.com", 
    messagingSenderId: "464053523281",
    appId: "1:464053523281:web:13fa96e7813c7323397970",
    measurementId: "G-EVC79ELRR7"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Auth persistence set to local");
  })
  .catch((error) => {
    console.error("Error setting auth persistence:", error);
  });

export { auth, db, googleProvider };
