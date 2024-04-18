//import './App.css';
import React,{useState} from "react";
import Header from './Componentes/Header.js';
import Body from './Componentes/Body.js';
import styled from 'styled-components';


const Contenedor = styled.div`
  display: flex;
  flex-direction: column;//alinea los componentes interiores en columna, uno arriba del otro
  width: 1024px;
  height: 100vh;
  background-color: gray;
`;



const App = ({socket}) => {
  //let cantPlayers = 0;                        //cantidad de jugadores conectados
  //let isPlaying = false;                      //si la partida esta activa o no
  const [state, setState] = useState({
    idPlayer:0,                                 //la id se recibe del servidor al conectarse
    cantPlayers: 0,                             //cantidad de jugadores conectados
    isPlaying: false,                           //si la partida esta activa o no
    board: [[-1,-1,-1],                         //tablero interno para gestionar el juego
            [-1,-1,-1],
            [-1,-1,-1]]
  });
  console.log("socket: "+ socket);
  console.log("FLAG");
  socket.emit('message',"HOLA MUNDO!");
  
  return (
    <Contenedor>
      <Header/>
      <Body/>
    </Contenedor>
  ); 
}





export default App;
