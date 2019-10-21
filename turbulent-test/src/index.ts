import  {startServer}  from './core/server';

(async function() {
    try{
        await startServer();

    }catch(err){
        console.log("problem launching server...");
    }
})()
   
