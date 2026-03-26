// firebase.ts
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBS3sXZI2-F0KDq7Lc7ZxWX1BheUQVsmwk",
  authDomain: "football-team-app-9b79a.firebaseapp.com",
  projectId: "football-team-app-9b79a",
  storageBucket: "football-team-app-9b79a.firebasestorage.app",
  messagingSenderId: "253666433028",
  appId: "1:253666433028:web:d23538ee9b45db6c93fd51",
};

// Inicializácia Firebase
const app = initializeApp(firebaseConfig);

// 🔥 Inicializácia Auth pre React Native (Expo Go)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const db = getFirestore(app);
export const storage = getStorage(app);

export { app, auth, db };

