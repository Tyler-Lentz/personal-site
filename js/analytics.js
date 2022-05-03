// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-analytics.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyCMNh_-P8eezJ3rfD6BC28qlHkggAp0ehk",
authDomain: "cse134b-hw5-1149b.firebaseapp.com",
projectId: "cse134b-hw5-1149b",
storageBucket: "cse134b-hw5-1149b.appspot.com",
messagingSenderId: "132890213985",
appId: "1:132890213985:web:5963907d7cb10958c9b420",
measurementId: "G-E8J3RXS2T3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);