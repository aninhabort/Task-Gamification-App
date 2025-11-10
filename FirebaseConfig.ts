import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD4o-8nrM9uRBEg8MbMUeFtzCmo91usD64",
  authDomain: "task-gamification-app.firebaseapp.com",
  projectId: "task-gamification-app",
  storageBucket: "task-gamification-app.firebasestorage.app",
  messagingSenderId: "870952656231",
  appId: "1:870952656231:web:e4829ece7e203429d2e3c2",
  measurementId: "G-2W623P35S1"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);

// Note: Firebase Auth automatically uses AsyncStorage for persistence in React Native
// when @react-native-async-storage/async-storage is installed