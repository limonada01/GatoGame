//import './App.css';
import React,{useEffect} from "react";
import Header from './Componentes/Header.js';
import Body from './Componentes/Body.js';
import styled from 'styled-components';


const Contenedor = styled.div`
  display: flex;
  flex-direction: column;//alinea los componentes interiores en columna, uno arriba del otro
  width: 1024px;
  height: 100vh;
  background-color: #3C3C3C;
`;

const App = ({socket}) => {
  
  useEffect(()=>{
    const handleConnection = () => {
      console.log('user connected'); 
    };
    socket.on('connect', handleConnection);
    return () => {
      socket.off('connect', handleConnection);
    };
  },[socket]);
 
 
  return (
    <Contenedor>
      <Header/>
      <Body socket = {socket} />
    </Contenedor>
  ); 
}

export default App;
