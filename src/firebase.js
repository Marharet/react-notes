import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDAXBFO10Ztc9cHPpLXnyeda7mjcuLKl4Y",
  authDomain: "react-notes-93331.firebaseapp.com",
  projectId: "react-notes-93331",
  storageBucket: "react-notes-93331.appspot.com",
  messagingSenderId: "69318041478",
  appId: "1:69318041478:web:1b1c5a96e34438ade4d607"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const notesCollection = collection(db, "notes")
