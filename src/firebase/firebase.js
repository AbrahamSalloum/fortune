import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAzMhIjTIO3apon0GockE9JClPkkDjwo24",
    authDomain: "fortune-71a88.firebaseapp.com",
    databaseURL: "https://fortune-71a88.firebaseio.com",
    projectId: "fortune-71a88",
    storageBucket: "fortune-71a88.appspot.com",
    messagingSenderId: "653707267747",
    appId: "1:653707267747:web:e6037009fc6a0320baf916"
  };

  firebase.initializeApp(firebaseConfig);
  console.log(firebase)
  const database = firebase.database();

  export { firebaseConfig, firebase, database as default };
