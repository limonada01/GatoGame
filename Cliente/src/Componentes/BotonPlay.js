import React from "react";
import styled from "styled-components";

const Boton = styled.button`
    height: 50px;
    width: 100px;
    background-color: green;
`;

const BotonPlay = () => {

    const play = () => {
        console.log("jugar!");
    }

    return ( 
        <>
            <Boton onClick={play}>PLAY</Boton>
        </>
    );
}




export default BotonPlay;