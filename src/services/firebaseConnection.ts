import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: "AIzaSyDnq3fMnKnqZm6b1S-wl6uthreukpSRybE",
  authDomain: "reactlinks-24218.firebaseapp.com",
  projectId: "reactlinks-24218",
  storageBucket: "reactlinks-24218.appspot.com", 
  messagingSenderId: "40121881829",
  appId: "1:40121881829:web:f1f6c8654452763a7ab00c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); 

export {auth, db, storage};