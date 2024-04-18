import React from "react";
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

const Body = () => {
    return ( 
      <Cuerpo>
        <Tablero/>
        <BotonPlay/>
      </Cuerpo>  
    );
}
 
export default Body;