export class TableModel{                              

    static state = {
        table: Array(9).fill(''),
        idPlayers: new Array(2),                        // guardo las ids de los jugadores que estan jugando o estan listo para jugar
        counter: 0,                                     // lleva el conteo de los turnos - Maximos de turnos: 9; la partida puede terminar antes
        isPlaying: false,                               // bandera para verificar si hay una partida en juego
        turn: ''                                        // almacena el id del jugador del cual se espera el siguiente movimiento
    }

    static getState = () => {                           
        // retorna el estado actual del juego, necesario para cuando se conecta un nuevo usuario
        // luego solo se actualiza según los movimientos de los jugadores en caso de una partida en curso
        let res = {
            isPlaying: this.state.isPlaying
        }
        if(this.state.isPlaying){               // si hay una partida en curso envio el tablero y los ids de los jugadores
            res = {
                ...res,
                table: this.state.table,
                idPlayers: this.state.idPlayers,
                currentTurn: this.state.turn
            }
        }
        return res;                              
    }

    static move = (id,pos) => {
        if(!this.state.idPlayers.includes(id)){
            console.error("invalid id, id player recived is not playing");
            return {response: 'error'};
        }
        this.updateTable(id,pos);
        let msg = 'ok';
        if (this.state.counter >= 5 && this.checkWinner()){          // si se hicieron al menos 5 movimientos y hay un ganador   
            console.log("User "+id+" WIN! Congrats");
            this.resetGame();                                        // reseteo el estado del juego
            msg = 'win';
        }else if(this.state.counter === 9){                          // si se llega al final del juego y no hay ganador 
            console.log("Draw!");
            this.resetGame();                                        // reseteo el estado del juego
            msg = 'draw';
        }
        
        this.changeTurn();                                           // cambio el turno
        //console.log('tabla actual: '+this.state.table);
        return {response: msg,
                pos: pos,
                turn: this.state.turn
            };
    }

    static updateTable = (id,pos) => {                          // actualiza el tablero segun el movimiento de un juegador(id)
        this.state.table[pos] = id;                             // actualizo el movimiento del jugador id con su id en la posicion en la que juego
        this.updateCounter(); 	                                // sumo uno al contador de jugadas 
        console.log("User: "+id+" played pos: "+ pos);
    }

    static resetGame = () => {
        this.state.table = Array(9).fill('');
        this.state.counter = 0;                                 // reseteo el contador de turnos
        this.changeIsPlaying();                                 // cambio le estado de juego
        this.state.idPlayers = new Array(2);                    // reseteo el arreglo de ids de jugadores listos para jugar
        this.state.turn = -1;                                   // reseteo la variable que almacena los turnos
        console.log("Table reseted!");            
        //return {response: 'reset'};
    }

    static checkWinner = () => {
        // Verificar filas
        for (let i = 0; i < 9; i+=3) {
            if (
            this.state.table[i] !== '' &&
            this.state.table[i] === this.state.table[i+1] &&
            this.state.table[i+1] === this.state.table[i+2]
            ) {
            return true;                                    // retorna true si hay ganador
            }
        }

        // Verificar columnas
        for (let i = 0; i < 3; i++) {
            if (
            this.state.table[i] !== '' &&
            this.state.table[i] === this.state.table[i+3] &&
            this.state.table[i+3] === this.state.table[i+6]
            ) {
            return true;                                    // retorna true si hay ganador
            }
        }

        // Verificar diagonales
        if (
            (this.state.table[0] !== '' &&
            this.state.table[0] === this.state.table[4] &&
            this.state.table[4] === this.state.table[8]) ||
            (this.state.table[2] !== '' &&
            this.state.table[2] === this.state.table[4] &&
            this.state.table[4] === this.state.table[6])
        ) {
            return true;                                    // retorna true si hay ganador
        }
        return false;                                       // retorna falso si no hay ganador
    }

    static updateCounter = () => {
        //console.log('flag from update counter!');
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
            isPlaying: this.state.isPlaying,                                     // retorna el nuevo estado del juego (jugando)
            playersIDs: this.state.idPlayers
        }                                                   
    }

    static changeIsPlaying = () => {
        this.state.isPlaying =  !this.state.isPlaying;
        //console.log("isPlaying: "+ this.state.isPlaying);
    }

    static checkReadyToPlay = () => {
        return  this.state.idPlayers[0] !== undefined &&  this.state.idPlayers[1] !== undefined; // retorna true si se puede jugar, falso en caso contrario
    }

    static addPlayerReadyToPlay = (idPlayer) => {
        this.state.idPlayers[0] === undefined ?  this.state.idPlayers[0] = idPlayer :  this.state.idPlayers[1] = idPlayer;  // agrego el jugador listo para jugar al arreglo
        console.log('New player '+idPlayer+' ready to play');
    }

    static changeTurn = () => {                                            // cambiar turno del jugador que debe mover
    if (this.state.turn === ''){
        this.state.turn =   this.state.idPlayers[0];                       // asigno la id del jugador que primero dio a play para que comience a mover
        //console.log('jugadores: '+this.state.idPlayers)
    }else if (this.state.turn ===    this.state.idPlayers[0]){             // si el turno actual es del jugador 1
            this.state.turn =   this.state.idPlayers[1];                   // cambio el turno al jugador 2
    }else{
        this.state.turn =   this.state.idPlayers[0];                       // cambio el turno al jugador 1
    }
    console.log('next turn: '+  this.state.turn);            
    }

    static playerDisconnected = (idPlayer) => {                            // cuando se desconecta un player que se encuentra en partida
        let res = {response: false};
        for(let i = 0; i < this.state.idPlayers.length;i++){
            if(this.state.idPlayers[i] === idPlayer){
                this.state.idPlayers[i] = undefined;                       // lo saco del registro de jugadores jugando
                if(this.state.isPlaying){                                  // si se desconecto un jugador que se encontraba jugando
                    res = {response: true}                                 // suspender la partida
                    this.resetGame();                                      // reinicio el estado del juego     
                }
                console.log('user '+idPlayer+' playing or ready to play is disconnected');
                break;
            }
        }
        return res;
    }
}


