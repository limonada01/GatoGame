import React,{useEffect} from "react";
import styled from "styled-components";
import Square from "./Square";

const Table = styled.div`
    background-color: #02B5F6;
    height: 500px;
    width: 500px;
    margin: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    gap: 0.8em;
`;



const Board = ({socket,boardState,turn,isPlayingState}) => {   
    
    return ( 
        <Table>
            {
                boardState.map((_,index) => {
                    return(
                        <Square key={index} index={index} value={boardState[index]} socket={socket} turn={turn} isPlayingState={isPlayingState} />
                    )
                })
            }
        </Table>
    );
}
 
export default Board;