import { WebSocketServer } from "ws";

const server = new WebSocketServer({
    port: Number(process.env.PORT || 8000)
})



server.on('connection', socket=>{
    console.log("Hey somebody joined")
    socket.on('message', (m)=>{
        
    })
    
})