import React,{useState,useEffect} from "react";
import styled from "styled-components";
import Board from "./Board";
import Panel from "./Panel";

const Cuerpo = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 80% 20%;
  height: 100vh; // le doy el maximo de altura
  place-items: center; //centra vertical y horizontal los elementos que se encuentran en el interior
`;


const FIGURES = {
    x: '❌',
    o: '⚪'
}

const Game = ({socket}) => {
    const [boardState,setBoardState] = useState(Array(9).fill(''));
    const [isPlayingState,setIsPlayingState] = useState(false);
    const [turnIDState,setTurnIDState] = useState('');
    const [isSpectatorState,setIsSpectatorState] = useState(false);
    const [showButtonPlay,setShowButtonPlay] = useState(true);
    const [showButtonReset,setShowButtonReset] = useState(false);
    const [textContentAlert,setTextContentAlert] = useState('');
    const [myFigure,setMyFigure] = useState('');
    const [oponentFigure,setOponentFigure] = useState('');
    const [playersArray,setPlayersArray] = useState(Array(2).fill(''));

    const handleResetState = () => {
        setBoardState(Array(9).fill(''));
        setIsPlayingState(false);
        setTurnIDState('');
        setIsSpectatorState(false);
        setShowButtonPlay(true);
        setShowButtonReset(false);
        setTextContentAlert('');
        setMyFigure('');
        setOponentFigure('');
        setPlayersArray(Array(2).fill(''));
    }

    useEffect(() => {
        if(playersArray[0] !== ''){                                // cuando el arreglo de jugadores no este vacio
            if(playersArray[0] === socket.id){                     // quien dio play primero
                setMyFigure(FIGURES.x);                            // juega con la x
                setOponentFigure(FIGURES.o);
            }else{
                setMyFigure(FIGURES.o);                      
                setOponentFigure(FIGURES.x);
            } 
        }
    },[socket,playersArray]);                                      // actualizo las figuras cuando cambia el arreglo de jugadores

    useEffect(() => {                                              // cambio el turno segun el servidor
        let text;
        turnIDState === socket.id ? text = 'Es mi Turno '+myFigure : text = 'Esperando rival '+oponentFigure;
        setTextContentAlert(text);
    },[socket,turnIDState,myFigure,oponentFigure]);

    useEffect(() => {

        const handleWinner = (idWinner,myID) => {
            let text = '';
            idWinner === myID ? text = 'Felicitaciones \n Ganaste 😎' : text = 'Lo siento \n Perdiste 😢';
            setTextContentAlert(text);                              // actualizo el texto informativo
            setShowButtonReset(true);                               // muestro el boton de reiniciar
        }
    
        const handleDraw = () => {                                  
            setTextContentAlert('Empate 🙃');                       // actualizo el texto informativo
            setShowButtonReset(true);                               // muestro el boton de reiniciar
        }
        
        const updateBoard = (pos) => {
            if(boardState[pos] === ''){                                            // solo puedo clickear si esta vacio
                setBoardState((prevBoard)=>{
                    const newBoard = [...prevBoard];                               // creo una copia del boardState previo
                    turnIDState === socket.id ? newBoard[pos] = myFigure : newBoard[pos] = oponentFigure;
                    return (newBoard)
                })
            }
        }

        const handleInitialState = (stateReceived) => {
            console.log('new state recived from server '+stateReceived);
            const {table,isPlaying} = stateReceived;
            if(isPlaying){      // si se está jugando
                // parseo a JSON para comprar los objetos de forma simple
                setIsPlayingState(isPlaying);
                setBoardState(table);   
                setShowButtonPlay(false);
                setTextContentAlert('Partida en Curso. Espere a que termine para jugar!');
                console.log('state updated!');
            }
        }

        const handlePlayResponse = (res) => {
            const {response} = res;
            if(response === 'wait_another_player'){                        // si es el primero en dar play, debe esperar un oponente
                console.log('Esperando a otro jugador: '+ response);
                setShowButtonPlay(false);                                  // deshabilito el boton de play
                setIsSpectatorState(false);                                // el jugador no será espectador
                setTextContentAlert('Esperando oponente...');              // habilito el nuevo texto informativo
            }else if(response === 'ok'){                                   // si ya habia alguien esperando rival 
                const {turn,isPlaying,playersIDs} = res;                    
                console.log('Comenzando partida...');
                setIsPlayingState(isPlaying);                              // cambio el estado de jugando
                setShowButtonPlay(false);                                  // deshabilito el boton de play
                if(!playersIDs.includes(socket.id)) {                      // si no soy uno de los jugadores (soy espectador)
                    setIsSpectatorState(true);                             // si no estoy a la espera de un rival, es porque recibi este mensaje siendo espectador
                    setTextContentAlert('Partida en Curso. Espere a que termine para jugar!');
                }else{                                                     // si soy uno de los jugadores (no espectador)
                    setPlayersArray(playersIDs);                           // guardo las ids de los jugadores                             
                    setTurnIDState(turn);                                  // incializo el nuevo turno segun el servidor
                }
                
            }
        }

        const handleMoveResponse = (res) => {
            const {response,pos,turn} = res;
            updateBoard(pos);                                     // actulizo el tablero                                                                         
            if(response === 'win'){                               // si hay un ganador tras la jugada
                const {winner} = res;                             // obtengo el id del ganador
                handleWinner(winner,socket.id);
            }else if(response === 'draw'){
                handleDraw();
            }else{
                setTurnIDState(turn);                             // cambio el turno segun el servidor
            }
        }

        
        socket.on('state', handleInitialState);
        socket.on('play-response', handlePlayResponse);
        socket.on('move-response', handleMoveResponse);
        return () => {  
            // limpio la suscripcion del manejador a los eventos al desmontar el componente
            socket.off('state', handleInitialState);
            socket.off('play-response',handlePlayResponse);         
            socket.off('move-response', handleMoveResponse);
        } 
    },[socket,turnIDState,myFigure,oponentFigure,boardState,textContentAlert]);

    return ( 
        <Cuerpo>
            <Board socket={socket} boardState={boardState} turn={turnIDState} />
            <Panel socket={socket} showButtonPlay={showButtonPlay} showButtonReset={showButtonReset} handleClickReset={handleResetState} textContentAlert={textContentAlert} />
        </Cuerpo>
    );
}
 
export default Game;