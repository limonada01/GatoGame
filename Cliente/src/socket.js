import io from 'socket.io-client'; //importo io cliente

const URL = 'http://localhost:3001'; 
//creo e inicializo el socket con IO, le paso la direccion del servidor. 
//SINO paso direc, busca en el mismo servidor

export const socket = io(URL);