import React from "react";
import styled from "styled-components"

const Titulo = styled.h1`
    color: white;
    
`;
const Contenedor = styled.div`
    width: 100%;
    height: 50px;
    background-color: #3C3C3C;
    border: 2px solid;
    border-radius: 10px;
    border-color: #02B5F6;
    display: flex;
    justify-content: center; /* Centrar horizontalmente */
    align-items: center; /* Centrar verticalmente */
`;
const Header = () => {
    return (
        <Contenedor>
            <Titulo>GATO</Titulo>
        </Contenedor> 
     );
}


export default Header;