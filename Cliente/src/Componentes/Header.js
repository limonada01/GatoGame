import React from "react";
import styled from "styled-components"

const Titulo = styled.h1`
    background-color: red;
    
`;
const Contenedor = styled.div`
    width: 100%;
    height: 50px;
    background-color: green;
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