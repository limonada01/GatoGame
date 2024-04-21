import { TableModel } from "../Models/TableModel.js";

export class GameController{

    static handleIO(io){

        io.on('connection', (socket) => {                               // recibe una conexion de un cliente
            console.log('a new user connected! id: '+socket.id);

            socket.emit('state', () => TableModel.getState);            // retorna el estado actual del juego a quien se acaba de conectar
            
            socket.on('play', () => {                                   // el usuario conectado presiona boton de jugar
                response = TableModel.startMatch(socket.id);
                socket.emit('play-response', response);
            });  

            socket.on('move',(message) =>{
                const {row,col} = message;
                if(row >= 0 && row <=2 && col >= 0 && col <= 2){        // verifico que los parametros sean correctos
                    response = TableModel.move(socket.id,row,col);      // invoco a la funcion move para ejecutar el movimiento
                    io.emit('move-response', response);                 // emito para todos los usuarios el movimiento
                }
            });
            
            socket.on('disconnect', () => {
                console.log('user '+socket.id+' disconnected');
            });
        });
        
    }  

    
}

// move = {raw: int, col: int} formato