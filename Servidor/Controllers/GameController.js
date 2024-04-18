

export class TableController{

    static handleIO(io){

        io.on('connection', (socket) => {                     //recibe una conexion de un cliente
            console.log('a new user connected! id: '+socket.id);
            
            
            socket.on('message',(msg) =>{
                console.log("mensaje enviado del usuario conectado: "+ msg);
            })


            socket.on('disconnect', () => {
                console.log('user '+socket.id+' disconnected');
            });
        });
        
    }  

    
}