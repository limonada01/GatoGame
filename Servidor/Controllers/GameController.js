import { TableModel } from "../Models/TableModel.js";

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
                    socket.broadcast.emit('play-response',res);         // envia el nuevo estado a todos, menos al remitente
                }                
            });  

            socket.on('move',(message) =>{
                let {pos} = message;
                if(pos >= 0 && pos <=8){                            // verifico que los parametros sean correctos
                    const res = TableModel.move(socket.id,pos);     // invoco a la funcion move para ejecutar el movimiento
                    const {response} = res;
                    if(response === 'win'){
                        io.emit('move-response', {                  // si hay un ganador, envio tambien el id del ganador
                            ...res,
                            winner: socket.id
                        });
                    }else{
                        io.emit('move-response', res);              // emito para todos los usuarios el movimiento excepto al socket que inicio la conexion
                    }
                }
            });
            
            socket.on('disconnect', () => {
                console.log('user '+socket.id+' disconnected');
                TableModel.playerDisconnected(socket.id);               // verifica si el jugador desonectado estaba jugando o estaba listo para jugar
            });
        });
        
    }  

    
}

