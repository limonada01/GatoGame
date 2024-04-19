export class TableModel{
    static table = [
                [-1,-1,-1],
                [-1,-1,-1],
                [-1,-1,-1]
    ];
    static idPlayers = new Array[2];                    // guardo las ids de los jugadores que estan jugando o estan listo para jugar
    static counter = 0;                                 // lleva el conteo de los turnos - Maximos de turnos: 9; la partida puede terminar antes
    static isPlaying = false;                           // bandera para verificar si hay una partida en juego 

    static move = (id,row,col) => {
        if(!this.idPlayers.includes(id)){
            return console.log("error: invalid id");
        }
        this.updateTable(id,row,col);
        if (counter >= 5 && this.checkWinner()){        // si se hicieron al menos 5 movimientos y hay un ganador   
            return console.log("User ",id," WIN! Congrats");
        }else if(counter === 9){                        // si se llega al final del juego y no hay ganador 
            return console.log("Draw!");
        }
    }

    static updateTable = (id,row,col) => {                 // actualiza el tablero segun el movimiento de un juegador(id)
        table[row][col] = id;                 // actualizo el movimiento del jugador id con su id en la posicion en la que juego
        this.updateCounter; 	                        // sumo uno al contador de jugadas
        return console.log("User: ",id," played raw: ", move.raw, "col: ",move.col);
    }

    static resetTable = () => {
        for (let raw = 0; raw < this.table.length; raw++){
            for(let col = 0; col < this.table[raw].length; col++){
                table[raw][col] = -1;
            }
        }
        this.counter = 0;                               // reseteo el contador de turnos
        this.changeIsPlaying;                           // cambio le estado de juego
        return console.log("Table reseted!")            
    }

    static checkWinner = () => {
        // Verificar filas
        for (let fila = 0; fila < tablero.length; fila++) {
            if (
            tablero[fila][0] !== -1 &&
            tablero[fila][0] === tablero[fila][1] &&
            tablero[fila][1] === tablero[fila][2]
            ) {
            return true;                                // retorna true si hay ganador
            }
        }

        // Verificar columnas
        for (let columna = 0; columna < tablero[0].length; columna++) {
            if (
            tablero[0][columna] !== -1 &&
            tablero[0][columna] === tablero[1][columna] &&
            tablero[1][columna] === tablero[2][columna]
            ) {
            return true;                                // retorna true si hay ganador
            }
        }

        // Verificar diagonales
        if (
            (tablero[0][0] !== -1 &&
            tablero[0][0] === tablero[1][1] &&
            tablero[1][1] === tablero[2][2]) ||
            (tablero[0][2] !== -1 &&
            tablero[0][2] === tablero[1][1] &&
            tablero[1][1] === tablero[2][0])
        ) {
            return true;                                // retorna true si hay ganador
        }
        return false;                                   // retorna falso si no hay ganador
    }

    static updateCounter = () => {
        this.counter++;
    }
    
    static startMatch = () => {
        this.changeIsPlaying;                           // isPlaying pasa a True
        //...
    }

    static changeIsPlaying = () => {
        this.isPlaying = !this.isPlaying;
        console.log("isPlaying: "+ this.isPlaying);
    }
}



