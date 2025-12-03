// firebase.ts
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyBS3sXZI2-F0KDq7Lc7ZxWX1BheUQVsmwk",
  authDomain: "football-team-app-9b79a.firebaseapp.com",
  projectId: "football-team-app-9b79a",
  storageBucket: "football-team-app-9b79a.appspot.com",
  messagingSenderId: "253666433028",
  appId: "1:253666433028:web:d23538ee9b45db6c93fd51"
};

// Inicializácia Firebase
const app = initializeApp(firebaseConfig);

// 🔥 Inicializácia Auth pre React Native (Expo Go)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore(app);

export { app, auth, db };