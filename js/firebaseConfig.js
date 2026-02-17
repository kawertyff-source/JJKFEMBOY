import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDJ4ILoZnzgXORGfII6Iyd-ORxHu4-j2QE",
  authDomain: "newqwe-5b6f7.firebaseapp.com",
  databaseURL: "https://newqwe-5b6f7-default-rtdb.firebaseio.com",
  projectId: "newqwe-5b6f7",
  storageBucket: "newqwe-5b6f7.firebasestorage.app",
  messagingSenderId: "11942471734",
  appId: "1:11942471734:web:44747434a2551c2c995097",
  measurementId: "G-ZLDHN2LVS8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
