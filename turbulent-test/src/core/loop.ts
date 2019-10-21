import {sockets} from "./socket"
import * as _ from "lodash";
import {refreshInterval} from "../configs/refreshInterval"
import { Packet } from "../models/packet";

function loop(io: SocketIO.Server) {
    setInterval(() =>{
       const packets: Packet[] = sockets.getPackets();
        if(!_.isNil(packets )){
            const now = new Date().getTime()
            packets.forEach( packet => {
                if((packet.deliveryTime-now) < 1000){
                    console.log(`the packet with message ${packet.msg} is ready to send! go!`)
                    io.emit('msg',packet.msg)
                }else{
                    console.log(`the packet with message ${packet.msg} is nearly ready to send, setting timeout ...`)
                    setTimeout( () =>{ io.emit('msg',packet.msg) }, packet.deliveryTime-now,packet);
                }
            });   
        }
    }, refreshInterval);
}

export let looping = loop;