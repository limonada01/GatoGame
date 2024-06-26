import styled from "styled-components";

const Cell = styled.div`
    max-width: 100%;
    max-height: 100%;
    background-color: #3C3C3C;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 50px;
    box-sizing: border-box;
`;

const Square = ({index,value,socket,turn,isPlayingState}) => {
    
    const handleClick = (pos,idPlayer,turnPlayer,isPlaying) => {
        if(idPlayer === turnPlayer && isPlaying) {                     // si es mi turno de jugar
            socket.emit('move',{pos: pos});
        }
    }

    return (
        <Cell onClick={() => handleClick(index,socket.id,turn,isPlayingState)}>
            {value}
        </Cell>        
    );
}
 
export default Square;