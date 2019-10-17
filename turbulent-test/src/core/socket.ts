import  * as socket from  "socket.io"
import * as fs from "fs"
import { MongoClient } from "mongodb";
import {Packet} from "../models/packet"
import * as _ from "lodash";

interface ISockets {
    socketList: socket.Socket[];
    packetList: Packet[];
    addSocket(newSocket: socket.Socket):Promise<void>;
    getPacket():Promise<Packet>;
    addPacket(newPacket: Packet):Promise<void>;
}

class Sockets implements ISockets{
    socketList: socket.Socket[] = [];
    packetList: Packet[] = [];


    async getPacket(){

    }

    async addPacket(newPacket: Packet){
        const i = _.sortedIndex(this.packetList,newPacket)
        this.packetList[i] = newPacket;
    }


    async addSocket(newSocket: socket.Socket){
        const i = _.sortedIndex(this.socketList,newSocket)
        this.socketList[i] = newSocket;
        // fs.writeFile("./meow.meow",JSON.stringify(socket),function ()  {
           // console.log("lawl");
           // this.socketList.push(newSocket);
        // });  
    }

    
    settimeout() {
        setTimeout(() =>{
            const sock = this.getPacket()
        }, 10000);
    }
}


export let sockets = new Sockets();