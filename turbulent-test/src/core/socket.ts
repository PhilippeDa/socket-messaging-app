import  * as socket from  "socket.io"
import * as fs from "fs"
import {Packet} from "../models/packet"
import * as _ from "lodash";
import {refreshInterval} from "../configs/refreshInterval"

interface ISockets {
    socketList: socket.Socket[];
    packetList: Packet[];
    readyToSendPackets: Packet[];
    addSocket(newSocket: socket.Socket):Promise<void>;
    getPackets():Packet[];
    addPacket(newPacket: Packet):Promise<void>;
}

class Sockets implements ISockets{
    socketList: socket.Socket[] = [];
    packetList: Packet[] = [];
    readyToSendPackets: Packet[] = [];


    getPackets(){
        this.readyToSendPackets = [];
        if(this.packetList.length > 0){
            const now: Date = new Date();
            console.log("now time: ",now.getTime(),"     delivery time: ", this.packetList[0].deliveryTime);

            let cut=0;
            for(let i = 0; i < this.packetList.length;i++){
                if(this.packetList[i].deliveryTime - now.getTime() <= refreshInterval ){
                    cut = i;
                }else {
                    break;
                }
            }
            this.readyToSendPackets = this.packetList.splice(0,cut+1)
            
            return this.readyToSendPackets;
        }
        return;
    }

    async addPacket(newPacket: Packet){
        if(this.packetList.length < 1){
            this.packetList.push(newPacket);
        } else {
            this.packetList.splice(_.sortedIndexBy(this.packetList, newPacket, 'deliveryTime'), 0, newPacket);
            console.log(this.packetList);
        }
        return;
    }


    async addSocket(newSocket: socket.Socket){
        this.socketList.push(newSocket);
    }

}


export let sockets = new Sockets();