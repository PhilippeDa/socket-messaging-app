import * as socketio from "socket.io"

export interface Packet {
    msg: string;
    deliveryTime: number;
}
