import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA13Q-fIreIbVaqHcE81jeaEtTBzyQqo48",
  authDomain: "crud-project-d1487.firebaseapp.com",
  projectId: "crud-project-d1487",
  storageBucket: "crud-project-d1487.firebasestorage.app",
  messagingSenderId: "322840164408",
  appId: "1:322840164408:web:2c3578197db4bb3a110ecd"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
