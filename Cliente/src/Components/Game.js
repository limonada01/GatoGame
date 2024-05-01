import React,{useState,useEffect} from "react";
import styled from "styled-components";
import Board from "./Board";
import Panel from "./Panel";
import confetti from "canvas-confetti";

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

    const handleTableReceived = (table,idPlayers) => {
        const newBoard = Array(9).fill('');
        table.forEach((element,index) => {
            if(element !== ''){
                element === idPlayers[0] ? newBoard[index] = FIGURES.x : newBoard[index] = FIGURES.o;
            }
        });
        return newBoard;
    }

    useEffect(() => {
        if(playersArray[0] !== '' && !isSpectatorState){           // cuando el arreglo de jugadores no este vacio (partida inciada) y no soy espectador
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
        if(!isSpectatorState){                                     // si no soy espectador
            let text;
            turnIDState === socket.id ? text = 'Es mi Turno '+myFigure : text = 'Esperando rival '+oponentFigure;
            setTextContentAlert(text);
        }
    },[socket,turnIDState,myFigure,oponentFigure,isSpectatorState]);

    useEffect(() => {

        const handleWinner = (idWinner,myID) => {
            let text = '';
            if(!isSpectatorState){                                  // si soy uno de los jugadores
                if(idWinner === myID){                              // si soy el ganador
                    text = 'Felicitaciones \n Ganaste 😎';
                    Promise.resolve().then(async () => await confetti()); // ejecuta confeti en segundo plano
                }else{                                              // si soy el perdefor
                    text = 'Lo siento \n Perdiste 😢';
                }
            }else{                                                  // si soy espectador
                idWinner === playersArray[0] ? text = `Ganan las ${FIGURES.x}` : text = `Ganan las ${FIGURES.o}`;
            }
            setTextContentAlert(text);                              // actualizo el texto informativo
            setShowButtonReset(true);                               // muestro el boton de reiniciar
            setIsPlayingState(false);                               
        }
    
        const handleDraw = () => {                                  
            setTextContentAlert('Empate 🙃');                       // actualizo el texto informativo
            setShowButtonReset(true);                               // muestro el boton de reiniciar
            setIsPlayingState(false);
        }
        
        const updateBoard = (pos) => {
            if(boardState[pos] === ''){                                            // solo puedo clickear si esta vacio
                setBoardState((prevBoard)=>{
                    const newBoard = [...prevBoard];                               // creo una copia del boardState previo
                    if(!isSpectatorState){                                         // si soy un jugador 
                        turnIDState === socket.id ? newBoard[pos] = myFigure : newBoard[pos] = oponentFigure;
                    }else{                                                         // si soy espectador
                        turnIDState === playersArray[0] ? newBoard[pos] = FIGURES.x : newBoard[pos] = FIGURES.o;
                    }
                    return (newBoard)
                })
            }
        }

        const handleInitialState = (stateReceived) => {
            console.log('new state recived from server '+stateReceived);
            const {isPlaying} = stateReceived;
            if(isPlaying){                          // si se está jugando - soy espectador
                const {table,idPlayers,currentTurn} = stateReceived;
                setIsPlayingState(isPlaying);
                setIsSpectatorState(true);
                setPlayersArray(idPlayers);
                const newBoard = handleTableReceived(table,idPlayers);
                setBoardState(newBoard); 
                setTurnIDState(currentTurn);
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
                }
                // sea jugador o espectador seteo turno y jugadores
                setPlayersArray(playersIDs);                               // guardo las ids de los jugadores                             
                setTurnIDState(turn);                                      // incializo el nuevo turno segun el servidor
                
                
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

        const handleSuspendGame = (res) => {
            const {response} = res;
            if (response) {                                       // si hay que suspender la partida
                !isSpectatorState ? setTextContentAlert('El oponente se ha desconectado') : setTextContentAlert('Un jugador se ha desconectado');
                setShowButtonReset(true);                               // muestro el boton de reiniciar
                setIsPlayingState(false);   
            }
        }
        
        socket.on('state', handleInitialState);
        socket.on('play-response', handlePlayResponse);
        socket.on('move-response', handleMoveResponse);
        socket.on('suspend', handleSuspendGame);
        return () => {  
            // limpio la suscripcion del manejador a los eventos al desmontar el componente
            socket.off('state', handleInitialState);
            socket.off('play-response', handlePlayResponse);         
            socket.off('move-response', handleMoveResponse);
            socket.off('suspend', handleSuspendGame);
        } 
    },[socket,turnIDState,myFigure,oponentFigure,boardState,textContentAlert]);

    return ( 
        <Cuerpo>
            <Board socket={socket} boardState={boardState} turn={turnIDState} isPlayingState={isPlayingState}/>
            <Panel socket={socket} showButtonPlay={showButtonPlay} showButtonReset={showButtonReset} handleClickReset={handleResetState} textContentAlert={textContentAlert} />
        </Cuerpo>
    );
}
 
export default Game;