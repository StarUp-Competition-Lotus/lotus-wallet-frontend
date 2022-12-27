import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB_uqbLfBNimIxr_iPpHVKNcIVHAVSQJwY",
    authDomain: "lotus-wallet.firebaseapp.com",
    databaseURL: "https://lotus-wallet-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "lotus-wallet",
    storageBucket: "lotus-wallet.appspot.com",
    messagingSenderId: "507792306994",
    appId: "1:507792306994:web:7ad19e8359d971f410dd2b",
};

const app = initializeApp(firebaseConfig);

const firestoreDb = getFirestore(app);
export default firestoreDb;