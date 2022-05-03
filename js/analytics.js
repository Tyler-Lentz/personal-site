// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyAtb7DzOShvBtuHq1z_dxuIc4oDsBWzaIo",
authDomain: "tyler-lentz.firebaseapp.com",
projectId: "tyler-lentz",
storageBucket: "tyler-lentz.appspot.com",
messagingSenderId: "639760361419",
appId: "1:639760361419:web:81086db94f44ef9467b84e",
measurementId: "G-1C7HDBWNZN"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);