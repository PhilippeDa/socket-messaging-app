import  * as socket from  "socket.io"
import * as fs from "fs"
import {Packet} from "../models/packet"
import * as _ from "lodash";
import { isObject } from "util";

interface ISockets {
    socketList: socket.Socket[];
    packetList: Packet[];
    addSocket(newSocket: socket.Socket):Promise<void>;
    getPacket():Packet;
    addPacket(newPacket: Packet):Promise<void>;
}

class Sockets implements ISockets{
    socketList: socket.Socket[] = [];
    packetList: Packet[] = [];


     getPacket(){
        if(this.packetList.length > 0){
            return this.packetList.pop()
        }
        return;
    }

    async addPacket(newPacket: Packet){
        if(this.packetList.length <1){
            this.packetList.push(newPacket);
        } else {
            Array.prototype.splice(_.sortedIndexBy(this.packetList, newPacket, 'deliveryTime'), 0, newPacket);
        }
        console.log("size of packet list",this.packetList.length);
        return;
    }


    async addSocket(newSocket: socket.Socket){
        this.socketList.push(newSocket);
    }

}


export let sockets = new Sockets();