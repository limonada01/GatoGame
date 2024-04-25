import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {socket} from './socket.js';


const root = ReactDOM.createRoot(document.getElementById('root'));
//React.StrictMode me ejecuta 2 veces el componente
root.render(
  //<React.StrictMode>
    <App socket = {socket}/>
  //</React.StrictMode>
);
