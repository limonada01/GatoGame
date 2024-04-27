import React,{useState,useEffect} from "react";
import styled from "styled-components";
import Tablero from "./Tablero";
import BotonPlay from "./BotonPlay";


// const Cuerpo = styled.div`
//     display: flex;
//     flex-direction: column;
//     justify-content: center; /* Centrar horizontalmente */
//     align-items: center; /* Centrar verticalmente */
//     height: 100vh; // le doy el maximo de altura
// `;

const Cuerpo = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 80% 20%;
  height: 100vh; // le doy el maximo de altura
  place-items: center; //centra vertical y horizontal los elementos que se encuentran en el interior
`;


const Body = ({socket}) => {
  console.log('body render!');
  
  const [state, setState] = useState({
    table: [[-1, -1, -1],                         // tablero interno para cargar el estado inicial del juego (para espectadores)
            [-1, -1, -1],
            [-1, -1, -1]],
    isPlaying: false                              // si la partida esta activa o no
  });

  const [turn,setTurn] = useState('');

  useEffect(() => {
    const handleStateUpdate = (newState) => {
      console.log('new state recived from server '+newState);
      if(JSON.stringify(state) !== JSON.stringify(newState)){      // solo actualizo cuando el estado recibido es diferente al actual
        // parseo a JSON para comprar los objetos de forma simple
        console.log('state updated!');
        setState(newState);   
      }
      
    };

    const handlePartialStateUpdate = (res) => {
      const {newIsPlaying} = res;
      setState((prevState) => ({
        ...prevState,
        isPlaying: newIsPlaying})
      );
    };

    const handleTurn = (res) => {
      const {response} = res;
      setTurn(response);
    }

    socket.on('turn',handleTurn);
    socket.on('state', handleStateUpdate);
    socket.on('partial-state', handlePartialStateUpdate);
    
    return () => {
      // Limpiar las suscripciones cuando el componente se desmonte
      socket.off('state', handleStateUpdate);
      socket.off('partial-state', handlePartialStateUpdate);
    };
    
  },[socket]);    // La dependencia socket asegura que el efecto se ejecute cuando socket cambie


  return (
    <Cuerpo>
      <Tablero socket={socket} />
      <BotonPlay socket={socket} isPlaying={state.isPlaying} turn/>
    </Cuerpo>
  );
}

export default Body;