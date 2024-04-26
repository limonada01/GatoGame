import React,{useState,useEffect} from "react";
import styled from "styled-components";

const Contenerdor = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
`;
const Boton = styled.button`
    height: 50px;
    width: 100px;
    background-color: #24292E;
    border: 2px solid;
    border-radius: 10px;
    border-color: #02B5F6;
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
    &:hover {
    background-color: #2980b9;
  }
`;

const Aviso = styled.span`
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    font-size: large;
`;


const BotonPlay = ({socket,isPlaying}) => {
    console.log('BotonPlay render');
    console.log('isPlaying from boton play: '+isPlaying);
    const [isVisible,setIsVisible] = useState(false);   
    const [textContentAviso, setTextContentAviso] = useState('');             
    // manejo la visibilidad del boton de play, no se puede mostrar cuando hay una partida en curso o
    // cuando se esta a la espera de otro jugador para comenzar la partida
    console.log('Visible: '+isVisible);

    useEffect(() => {
        if(!isPlaying){
            setIsVisible(true);           // si no se esta jugando entonces muestro el boton de jugar
        }                                                                    
        else{
            setIsVisible(false);          // sino lo oculto
            setTextContentAviso('Partida en curso...');
        }
    }, [isPlaying]);                      // Se ejecutará cada vez que isPlaying cambie

    useEffect(() =>{
        const handlePlayResponse = (res) => {                       // defino el manjerador para el evento play-response
            console.log('response from server: '+res);
            const {response} = res;
            if(response === 'wait_another_player'){
                console.log('Esperando a otro jugador: '+ response);
                setIsVisible(false);
                setTextContentAviso('Esperando rival...');
            }else if(response === 'ok'){
                console.log('comenzando partida...');
                setIsVisible(false);
                setTextContentAviso('Comenzando Partida...');
            }
        }

        const handleResult = (res) => {
            const {response} = res;
            if(response === 'win'){
                const {id} = res;
                if(socket.id === id){
                    setTextContentAviso('Tu GANAS!')
                }else{
                    setTextContentAviso('Tu PIERDES!')
                }
            }else{
                setTextContentAviso('EMPATE!')
            } 
        };

        socket.on('play-response', handlePlayResponse);             // suscribo el manejador al evento
        socket.on('result', handleResult);
        return () => {
            socket.off('play-response',handlePlayResponse);         // limpio la suscripcion del manejador al evento playresponse al desmontar el componente
        }                                       
    },[socket]);                                                    // establezco el socket como dependencia, de esta forma se ejecuta el contido del use effect cada vez que cambia el socket            

    

    const handleClickPlay = () => {
        console.log("jugar!");
        socket.emit('play'); 
    }


    return ( 
        <Contenerdor>
            {isVisible ? <Boton onClick={handleClickPlay}>PLAY</Boton> : <Aviso>{textContentAviso}</Aviso> }
        </Contenerdor>
    );
}




export default BotonPlay;