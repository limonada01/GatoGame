import React,{useState} from "react";
import styled from "styled-components";
import Tablero from "./Tablero";
import BotonPlay from "./BotonPlay";


const Cuerpo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center; /* Centrar horizontalmente */
    align-items: center; /* Centrar verticalmente */
    height: 100vh; // le doy el maximo de altura
`;

const Body = ({socket}) => {

  const [state, setState] = useState({
    table: [[-1, -1, -1],                         // tablero interno para gestionar el juego
            [-1, -1, -1],
            [-1, -1, -1]],
    isPlaying: false                              // si la partida esta activa o no
  });

  socket.on('state', (newState) =>{
    console.log('new state recived from server');
    setState(newState);
  })
  return (
    <Cuerpo>
      <Tablero socket={socket} />
      <BotonPlay socket={socket} isPlaying={state.isPlaying} />
    </Cuerpo>
  );
}

export default Body;