import { useState } from "react";
import styled from "styled-components";

const Contenedor = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const Boton = styled.button`
    height: 50px;
    width: 100px;
    background-color: #24292E;
    border: 2px solid;
    border-radius: 10px;
    border-color: #02B5F6;
    color: white;
    margin: 5px;
    font-size: 16px;
    cursor: pointer;
    
    transition: background-color 0.3s;
    &:hover {
    background-color: #2980b9;
  }
`;

const Aviso = styled.span`
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    font-size: 40px;
    color: white;
`;


const Panel = ({socket,showButtonPlay,showButtonReset,handleClickReset,textContentAlert}) => {

    const handleClickPlay = () => {
        socket.emit('play'); 
    }

    return ( 
        <Contenedor>
            {showButtonPlay ? <Boton onClick={handleClickPlay}>PLAY</Boton> : <Aviso>{textContentAlert}</Aviso> }
            {showButtonReset && <Boton onClick={handleClickReset}>Reiniciar</Boton> }
        </Contenedor>  
    )
}
 
export default Panel;