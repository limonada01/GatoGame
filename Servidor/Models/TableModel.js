export class TableModel{                              

    static state = {
        table: [
            [-1,-1,-1],
            [-1,-1,-1],
            [-1,-1,-1]
        ],
        idPlayers: new Array(2),                        // guardo las ids de los jugadores que estan jugando o estan listo para jugar
        counter: 0,                                     // lleva el conteo de los turnos - Maximos de turnos: 9; la partida puede terminar antes
        isPlaying: false,                               // bandera para verificar si hay una partida en juego
        turn: -1                                        // almacena el id del jugador del cual se espera el siguiente movimiento
    }

    static getState = () => {                           // retorna el estado actual del juego, necesario para cuando se conecta un nuevo usuario
        return {                                        // luego solo se actualiza según los movimientos de los jugadores en caso de una partida en curso
            table: this.state.table,
            isPlaying: this.state.isPlaying
        };                              
    }

    static move = (id,row,col) => {
        if(!state.idPlayers.includes(id)){
            console.error("invalid id, id player recived is not playing");
            return {response: 'error'};
        }
        updateTable(id,row,col);
        if (this.state.counter >= 5 && checkWinner()){             // si se hicieron al menos 5 movimientos y hay un ganador   
            console.log("User "+id+" WIN! Congrats");
            this.resetGame;                                        // reseteo el estado del juego
            return {response: 'win',
                    row: row,
                    col: col
                }
        }else if(this.state.counter === 9){                        // si se llega al final del juego y no hay ganador 
            console.log("Draw!");
            this.resetGame;                                        // reseteo el estado del juego
            return {response: 'draw',
                    row: row,
                    col: col
                };
        }
        return {response: 'ok',
                row: row,
                col: col
            };
    }

    static updateTable = (id,row,col) => {                      // actualiza el tablero segun el movimiento de un juegador(id)
        this.state.table[row][col] = id;                        // actualizo el movimiento del jugador id con su id en la posicion en la que juego
        this.updateCounter; 	                                // sumo uno al contador de jugadas 
        console.log("User: "+id+" played raw: "+ row+ "col: "+col);
    }

    static resetGame = () => {
        for (let raw = 0; raw < this.state.table.length; raw++){
            for(let col = 0; col < this.state.table[raw].length; col++){
                table[raw][col] = -1;
            }
        }
        this.state.counter = 0;                                 // reseteo el contador de turnos
        this.changeIsPlaying();                                 // cambio le estado de juego
        this.state.idPlayers = new Array(2);                    // reseteo el arreglo de ids de jugadores listos para jugar
        this.state.turn = -1;                                   // reseteo la variable que almacena los turnos
        console.log("Table reseted!");            
        //return {response: 'reset'};
    }

    static checkWinner = () => {
        // Verificar filas
        for (let row = 0; row < this.state.table.length; row++) {
            if (
            this.state.table[row][0] !== -1 &&
            this.state.table[row][0] === this.state.table[row][1] &&
            this.state.table[row][1] === this.state.table[row][2]
            ) {
            return true;                                    // retorna true si hay ganador
            }
        }

        // Verificar columnas
        for (let col = 0; col < this.state.table[0].length; col++) {
            if (
            this.state.table[0][col] !== -1 &&
            this.state.table[0][col] === this.state.table[1][col] &&
            this.state.table[1][col] === this.state.table[2][col]
            ) {
            return true;                                    // retorna true si hay ganador
            }
        }

        // Verificar diagonales
        if (
            (this.state.table[0][0] !== -1 &&
            this.state.table[0][0] === this.state.table[1][1] &&
            this.state.table[1][1] === this.state.table[2][2]) ||
            (this.state.table[0][2] !== -1 &&
            this.state.table[0][2] === this.state.table[1][1] &&
            this.state.table[1][1] === this.state.table[2][0])
        ) {
            return true;                                    // retorna true si hay ganador
        }
        return false;                                       // retorna falso si no hay ganador
    }

    static updateCounter = () => {
        this.state.counter++;
    }
    
    static startMatch = (idPlayer) => {
        if (this.state.isPlaying) return {response: 'match_in_progress'};       // se encuentra una partida en curso                
        this.addPlayerReadyToPlay(idPlayer);                                    // añado al jugador que intenta jugar
        if (!this.checkReadyToPlay()) return {response: 'wait_another_player'}; // falta un jugador para comenzar la partida
        // ready para comenzar la partida
        this.changeIsPlaying();                                                 // cambiar el estado del juego a jugando (isPlaying = true)
        this.changeTurn();                                                      // establecer primer turno
        return {
            response: 'ok',
            turn: this.state.turn,                                              // retorna la id de quien tiene que realizar el proximo movimiento
            isPlaying: this.state.isPlaying                                     // retorna el nuevo estado del juego (jugando)
        }                                                   
    }

    static changeIsPlaying = () => {
        this.state.isPlaying =  !this.state.isPlaying;
        console.log("isPlaying: "+ this.state.isPlaying);
    }

    static checkReadyToPlay = () => {
        return  this.state.idPlayers[0] !== undefined &&  this.state.idPlayers[1] !== undefined ? true : false; // retorna true si se puede jugar, falso en caso contrario
    }

    static addPlayerReadyToPlay = (idPlayer) => {
        this.state.idPlayers[0] === undefined ?  this.state.idPlayers[0] = idPlayer :  this.state.idPlayers[1] = idPlayer;  // agrego el jugador listo para jugar al arreglo
        console.log('New player '+idPlayer+' ready to play');
    }

    static changeTurn = () => {                                            // cambiar turno del jugador que debe mover
    if (this.state.turn === -1){
        this.state.turn =   this.state.isPlaying[0];                       // asigno la id del jugador que primero dio a play para que comience a mover
        console.log('fist turn');
    }else if (this.state.turn ===    this.state.isPlaying[0]){             // si el turno actual es del jugador 1
            this.state.turn =   this.state.isPlaying[1];                   // cambio el turno al jugador 2
    }else{
        this.state.tunr =   this.state.isPlaying[0];                       // cambio el turno al jugador 1
    }
    console.log('next turn: '+  this.state.turn);            
    }

    static playerDisconnected = (idPlayer) => {                            // cuando se desconecta un player que se encuentra en partida
        for(let i = 0;i<this.state.idPlayers.length;i++){
            if(this.state.idPlayers[i] === idPlayer){
                this.state.idPlayers[i] = undefined;                       // lo saco del registro de jugadores jugando
                console.log('user '+idPlayer+' playing or ready to play is disconnected');
                break;
            }
        }
    }
}


