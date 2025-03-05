// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfJ9VVF5huBK558QLA-24TlmT_ETnX6_4",
  authDomain: "lumigram-f78e4.firebaseapp.com",
  projectId: "lumigram-f78e4",
  storageBucket: "lumigram-f78e4.firebasestorage.app",
  messagingSenderId: "339956480270",
  appId: "1:339956480270:web:d0614dff318f21b4fd7f5f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Auth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});