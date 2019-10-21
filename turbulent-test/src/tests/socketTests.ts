import {expect} from 'chai';  
import ioClient from  'socket.io-client';
import {startServer} from "../core/server"
import * as fs from "fs";

const options = {
    transports: ['websocket'],
    'force new connection': true
}

describe('tests!', () => {
    let client: any;

    before( (done) => {
        startServer();
        done();
    });


    beforeEach((done)=>{
        fs.unlink('savedPackets.json', (err) => {
            if (err) console.log('\n');

          });
        client = ioClient.connect('http://localhost:3000',options);
        client.on('connect', () => {
            done();
        });
    });


    afterEach((done) => {
        if (client.connected) {
          client.disconnect(); 
        }
        done();
    });

    it('should save the messages to a file',(done) =>{
        const now = new Date().getTime();
        const aBitLater = now +100000;
        const msg = {msg:'test1',deliveryTime:Math.round(aBitLater/1000)}
        const formatedMsg =  {msg:msg.msg,deliveryTime:msg.deliveryTime*1000};

        // we wait for server to start before sending msg
        setTimeout(()=>{
            client.emit("msg", msg);

            // we wait for the server to process the msg and save the file
            setTimeout(()=>{
                checkIfFileWasSaved();
                done();
            },10000)
        },15000)

        function checkIfFileWasSaved(){
            const rawData:string = fs.readFileSync('savedPackets.json', "utf8");
            const packetList = JSON.parse(rawData);
            expect(packetList[0].msg).equals(formatedMsg.msg);
            expect(packetList[0].deliveryTime).equals(formatedMsg.deliveryTime);
        }
    });

    it('should send a message in the future on time', (done) => {
        const now = new Date().getTime();
        //  30 seconds later
        const aBitLater = now+30000;
        const msg = {msg:'test2',deliveryTime:Math.round(aBitLater/1000)}
 
        
        client.emit("msg", msg);

        // we wait for the server to process the msg and save the file
        
        client.on("msg",(data)=>{
            const newNow = Math.round(new Date().getTime()/1000);
            expect(data).exist;
            expect(newNow - msg.deliveryTime).lessThan(1000);
            done();
        });
    });

    //it should send msg after the server restart (todo)
})