// Import the functions you need from the SDKs you need
const { initializeApp } = require('firebase/app')

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyBosUQGbyVU07FwYNH8TyCOiY8MMS6AHlk",
    authDomain: "greenium-trade.firebaseapp.com",
    projectId: "greenium-trade",
    storageBucket: "greenium-trade.appspot.com",
    messagingSenderId: "360512908439",
    appId: "1:360512908439:web:a3a310199a65a9be534dd2",
    measurementId: "G-7NSL2TVNKT"
}

const myApp = initializeApp(firebaseConfig);

module.exports  = myApp


