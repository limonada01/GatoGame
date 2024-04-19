import { TableModel } from "../Models/tableModel";

export class GameController{

    static handleIO(io){

        io.on('connection', (socket) => {                           // recibe una conexion de un cliente
            console.log('a new user connected! id: '+socket.id);
            
            
            socket.on('message',(msg) =>{
                console.log("mensaje enviado del usuario conectado: "+ msg);
            })
            
            socket.on('move',(msg) =>{
                const {row,col} = msg;
                if(row >= 0 && row <=2 && col >= 0 && col <= 2){    // verifico que los parametros sean correctos
                    TableModel.move(socket.id,row,col);             // invoco a la funcion move para ejecutar el movimiento
                }
                
            })

            socket.on('disconnect', () => {
                console.log('user '+socket.id+' disconnected');
            });
        });
        
    }  

    
}

// move = {raw: int, col: int} formato