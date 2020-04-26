import * as firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/functions';

firebase.initializeApp({
    apiKey: 'AIzaSyDh60iA3Yzs8tr_NFQKc8jGUaJA3Ic73ig',
    authDomain: 'game-89897.firebaseapp.com',
    databaseURL: 'https://game-89897.firebaseio.com',
    projectId: 'game-89897',
    storageBucket: 'game-89897.appspot.com',
    messagingSenderId: '665545464872',
    appId: '1:665545464872:web:87e637133856d40f5ba91d',
    measurementId: 'G-59CTFLXESZ',
});

firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(() => {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
        return firebase.auth().signInAnonymously();
    })
    .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(`${errorCode} ${errorMessage}`);
    });

export default firebase;
export const db = firebase.database();
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const functions = firebase.functions();
