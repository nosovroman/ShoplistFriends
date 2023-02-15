import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import firebase from 'firebase'

// данные из консоли
const firebaseConfig = {
  apiKey: "AIzaSyBpfS_iE6YLh6s8KRRTtdV9azCvSI0eths",
  authDomain: "test-4c909.firebaseapp.com",
  databaseURL: "https://test-4c909-default-rtdb.firebaseio.com",
  projectId: "test-4c909",
  storageBucket: "test-4c909.appspot.com",
  messagingSenderId: "275053984832",
  appId: "1:275053984832:web:7914d21c77373d5dcef3a5"
};

// инициализация firebase
firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
