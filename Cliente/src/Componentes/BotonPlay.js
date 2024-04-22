import React from "react";
import styled from "styled-components";

const Boton = styled.button`
    height: 50px;
    width: 100px;
    background-color: green;
`;

const BotonPlay = ({socket,isPlaying}) => {

    const play = () => {
        console.log("jugar!");
        socket.emit('play');
        socket.on('play-response', (res) => {
            console.log('response from user: '+res);
        });
    }

    

    return ( 
        <>
            {!isPlaying ? <Boton onClick={play}>PLAY</Boton> : <span>partida en curso</span> }
        </>
    );
}




export default BotonPlay;