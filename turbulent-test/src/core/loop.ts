import {sockets} from "./socket"
import * as _ from "lodash";

function loop(io: SocketIO.Server) {
    setInterval(() =>{
        
        const packet = sockets.getPacket();
        if(!_.isNil(packet)){
            io.emit('msg',packet.msg)
        }
        
    }, 10000);
}

export let looping = loop;