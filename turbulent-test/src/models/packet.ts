import * as socketio from "socket.io"

export interface Packet {
    socket: socketio.Socket;
    msg: string;
    deliveryTime: Date;
}
