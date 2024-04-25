import { TableModel } from "../Models/tableModel.js";

export class GameController{

    static handleIO(io){

        io.on('connection', (socket) => {                               // recibe una conexion de un cliente
            console.log('a new user connected! id: '+socket.id);
            

            socket.emit('state', TableModel.getState());                // retorna el estado actual del juego a quien se acaba de conectar
            

            socket.on('play', () => {                                   // el usuario conectado presiona boton de jugar
                let res = TableModel.startMatch(socket.id);
                socket.emit('play-response', res);
                const {response} = res;
                if (response === 'ok'){                                 // si ya estan los jugadores para comenzar la partida
                    const {isPlaying} = res;
                    io.emit('partial-state',{newIsPlaying: isPlaying}); // envia el nuevo estado del juego (jugando)
                }
                
            });  

            socket.on('move',(message) =>{
                let {row,col} = message;
                if(row >= 0 && row <=2 && col >= 0 && col <= 2){        // verifico que los parametros sean correctos
                    response = TableModel.move(socket.id,row,col);      // invoco a la funcion move para ejecutar el movimiento
                    io.emit('move-response', response);                 // emito para todos los usuarios el movimiento
                }
            });
            
            socket.on('disconnect', () => {
                console.log('user '+socket.id+' disconnected');
                TableModel.playerDisconnected(socket.id);               // verifica si el jugador desonectado estaba jugando o estaba listo para jugar
            });
        });
        
    }  

    
}

// move = {raw: int, col: int} formato