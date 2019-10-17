import express from "express";
import socket from "socket.io";
import path from "path";
import {sockets} from "./socket"
import {Packet} from "../models/packet"
import * as _ from "lodash";
import { looping } from "./loop";

export async function startServer(): Promise<express.Application> {
 
    const app = express();
    let http = require("http").Server(app);
    let io = socket(http);

    // we need some sort of a client otherwise its a bit boring.
    app.get('/', function(req, res){
        res.sendFile(path.resolve("./src/index.html"));
    });

    io.on("connection", async function(socket: any) {

        socket.on('msg',(data) => {
            console.log("we receive that",data);
            const newPacket: Packet = {
                socket:socket,
                msg: data.msg,
                deliveryTime: data.deliveryTime
            }

            sockets.addPacket(newPacket);

            
        });

        socket.on('disconnect', function(){
            console.log('user disconnected');
          });


        await sockets.addSocket(socket);       
        console.log("a user connected");
    }); 

    looping(io);

    const server = http.listen(3000, function() {
        console.log("listening on *:3000");
      });
   
    return server;
}