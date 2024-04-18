import express from 'express';                  //importar express
import logger from 'morgan';                    //importar logger de morgan para monitorear peticiones http (quitar al subir a produccion?)
import {Server} from 'socket.io';               //importar Server socket.io (para crear server de websocket)
import {createServer} from 'node:http';         //importo modulo de node para poder crear servidores http
//import cors from 'cors';                        //importar middleware cors
import {GameController} from './Controllers/GameController.js';

const port = process.env.PORT ?? 3001;          //usa la variable de entorno si está disponible, sino usa el definido

const app = express();                          //creamos instancia de aplicacion express 
const serverHTTP = createServer(app);           //creamos servidor http con la instancia de express para unificar funcionalidades
const io = new Server(serverHTTP,{
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }//cors, para poder responder a solicitudes del origen definido
});                                             //habilito el websocket en el servidor http creado 
                                                //ahora tenemos todas las funcionalidades en el mismo server
//app.use(cors());                              //usar middleware cors en cada conexion para permitir todos los origenes, en produccion VERIFICAR! 
app.use(logger('dev'));                         //usar el logger en modo dev en todas las solicitudes
 

GameController.handleIO(io);                   //llamo al controlador de las conexiones



app.get('/', (req,res)=>{                       //respuesta para la url raiz
    //res.sendFile(process.cwd()+'./../Cliente/public/index.html'); //Servir la pagina cliente al ingresar a la url raiz
    res.send("path: "+process.cwd())
})

serverHTTP.listen(port, ()=>{                          //inicia el socket y queda a la escucha de peticiones por el puerto definido
    console.log(`Server running on port ${port}`);
})

