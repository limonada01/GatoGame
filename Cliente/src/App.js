//import './App.css';
import React from "react";
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
  
  socket.on('connect',() => {
    console.log('user connected'); 
  })
 
  return (
    <Contenedor>
      <Header/>
      <Body socket = {socket} />
    </Contenedor>
  ); 
}





export default App;
