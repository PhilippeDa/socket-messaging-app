import  * as socket from  "socket.io"


interface ISockets {
    socketList: socket.Socket[];
    
}

class Sockets implements ISockets{
    socketList: socket.Socket[];

}


export let sockets = new Sockets();