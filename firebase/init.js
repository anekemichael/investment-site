// Import the functions you need from the SDKs you need
const { initializeApp } = require('firebase/app')

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyAs7Rk-SKz5HWyCUNHHRfEgRKBpfkJ5Efk",
    authDomain: "greenium-trades.firebaseapp.com",
    projectId: "greenium-trades",
    storageBucket: "greenium-trades.appspot.com",
    messagingSenderId: "800918377895",
    appId: "1:800918377895:web:c34e0ac332b3de38931282",
    measurementId: "G-DQ5MB8E6VG"
}

const myApp = initializeApp(firebaseConfig);

module.exports  = myApp


