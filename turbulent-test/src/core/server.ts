import * as express from "express";
import * as socket from "socket.io";

const app = express();
let http = require("http").Server(app);
let io = require("socket.io")(http);

io.on("connection", function(socket: any) {
    console.log("a user connected");
});

