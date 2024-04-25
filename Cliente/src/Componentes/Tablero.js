import React from "react";
import styled from "styled-components";

const Tabla = styled.div`
    background-color: pink;
    height: 500px;
    width: 500px;
    margin: 20px;
    
`;

const Row = styled.div`
    display: flex;
`;

const Cell = styled.div`
    height: 100px;
    width: 100px;
`;

const Tablero = ({socket}) => {// move: representa la posicion de la jugada del contrincante
    
    console.log('Tablero render');

    const marcar = (row,col,idPosition) =>{//recibo el className de la celda
        let celda = document.querySelector('.'+idPosition);
        celda.innerHTML = 'X';
        console.log("click en "+idPosition)
    } 

    return (
        <Tabla>
            <Row className="f1">{/*primera fila*/}
                <Cell className="c00" onClick={() => marcar(0,0,"c00")}></Cell>
                <Cell className="c01" onClick={() => marcar(0,1,"c01")}></Cell>
                <Cell className="c02" onClick={() => marcar(0,2,"c02")}></Cell>
            </Row>
            <Row className="f2">{/*segunda fila*/}
                <Cell className="c10" onClick={() => marcar(1,0,"c10")}></Cell>
                <Cell className="c11" onClick={() => marcar(1,1,"c11")}></Cell>
                <Cell className="c12" onClick={() => marcar(1,2,"c12")}></Cell>
            </Row>
            <Row className="f3">{/*tercera fila*/}
                <Cell className="c20" onClick={() => marcar(2,0,"c20")}></Cell>
                <Cell className="c21" onClick={() => marcar(2,1,"c21")}></Cell>
                <Cell className="c22" onClick={() => marcar(2,2,"c22")}></Cell>
            </Row>
        </Tabla>
     );
}




export default Tablero;