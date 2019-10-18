import {sockets} from "./socket"
import * as _ from "lodash";
import {refreshInterval} from "../configs/refreshInterval"
import { Packet } from "../models/packet";

const readyToSendPackets: Packet[] = []

function loop(io: SocketIO.Server) {
    

    setInterval(() =>{
       this.readyToSendPackets = sockets.getPackets();
        if(!_.isNil(this.readyToSendPackets )){
            const now = new Date().getTime()

            this.readyToSendPackets .forEach( packet => {
               setTimeout( () =>{ io.emit('msg',packet.msg) }, packet.deliveryTime-now,packet);
            })
        }
        
    }, refreshInterval);
}

export let looping = loop;