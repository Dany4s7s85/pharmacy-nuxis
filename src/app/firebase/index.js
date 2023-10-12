import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC66eXFuH74qzMsB9ac1iE9HK5oeshh5Fo",
  authDomain: "nxus-8dc57.firebaseapp.com",
  projectId: "nxus-8dc57",
  storageBucket: "nxus-8dc57.appspot.com",
  messagingSenderId: "33311287829",
  appId: "1:33311287829:web:ac907bbf909337fb16bc1c",
  measurementId: "G-4EL28K7RCY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
