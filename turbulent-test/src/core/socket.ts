import  * as socket from  "socket.io"
import * as fs from "fs"
import {Packet} from "../models/packet"
import * as _ from "lodash";
import {refreshInterval} from "../configs/refreshInterval"

interface ISockets {
    weAlreadyTriedFetchingSavedPackets:boolean;
    socketList: socket.Socket[];
    packetList: Packet[];
    readyToSendPackets: Packet[];
    getPackets():Packet[];
    addPacket(newPacket: Packet):Promise<void>;
    retrieveSavedPackets():void;
    savePacketsToFile():void;
}

class Sockets implements ISockets{
    weAlreadyTriedFetchingSavedPackets=false;
    socketList: socket.Socket[] = [];
    packetList: Packet[] = [];
    readyToSendPackets: Packet[] = [];

    retrieveSavedPackets(){
        try{
            const rawData:string = fs.readFileSync('savedPackets.json', "utf8");
            this.packetList = JSON.parse(rawData);
            return;
        }catch(err){
            throw err;
        }
    }

    getPackets(){
        if(!this.weAlreadyTriedFetchingSavedPackets){
            console.log("Trying to retrieve saved packets ...")
            try{
                this.retrieveSavedPackets();
                this.weAlreadyTriedFetchingSavedPackets=true;
                console.log("Retrieved saved packets succesfully!")
            }catch(err){
                console.log("no file to retrieve data from, but we tried!");
                this.weAlreadyTriedFetchingSavedPackets=true;
            }
        }

        this.readyToSendPackets = [];
        if(this.packetList.length > 0){
            const now: number = new Date().getTime();
            console.log(`present time: ${Math.round(now/1000)} ... delivery time of next message ...  ${Math.round(this.packetList[0].deliveryTime/1000)}`);
            let cut=0;
            let diff: number=0;
            let weFoundSomethingToSend=false;
            for(let i = 0; i < this.packetList.length;i++){
                diff = this.packetList[i].deliveryTime - now;
                if(diff <= refreshInterval){
                    cut = i;
                    weFoundSomethingToSend=true;
                }else {
                    break;
                }
            }
            if(weFoundSomethingToSend){
                this.readyToSendPackets = this.packetList.splice(0,cut+1)
                this.savePacketsToFile();
            }
        
            return this.readyToSendPackets;
        }
        return;
    }

    async addPacket(newPacket: Packet){
        if(this.weAlreadyTriedFetchingSavedPackets){
            if(this.packetList.length < 1){
                this.packetList.push(newPacket);
            } else {
                this.packetList.splice(_.sortedIndexBy(this.packetList, newPacket, 'deliveryTime'), 0, newPacket);
                console.log("message added to long term list ... packets so far => :",this.packetList);
            }
            await this.savePacketsToFile();
            return;
        }
        console.log("dont send msg while the server is starting up ... ")
    }

    async savePacketsToFile(){
        let file: fs.WriteStream = fs.createWriteStream('savedPackets.json');
        await file.write(JSON.stringify(this.packetList));
        file.end();
    }
}


export let sockets = new Sockets();