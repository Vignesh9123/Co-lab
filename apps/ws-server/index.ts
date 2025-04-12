import { WebSocketServer } from "ws";
import { roomManager } from "./RoomManager";
import { rtcManager } from "./RTCManager";
const server = new WebSocketServer({
    port: Number(process.env.PORT || 8000)
})



server.on('connection', socket=>{
    console.log("Hey somebody joined")
    socket.on('message', (m)=>{
        const messageJson = JSON.parse(m.toString())
        if(messageJson.type == "message"){
            // TODO: Send a indicator to the other user that a message is being sent
            // TODO: Make a DB call to save the message
            const message = {
                type:"message",
                data: messageJson.data,
                from: messageJson.from
            }
            const roomId = messageJson.roomId
            roomManager.sendMessageToRoom(message, roomId)
        }
        if(messageJson.type == "offer"){
            const offer = messageJson.offer
            const roomId = messageJson.roomId
            const from = messageJson.from
            rtcManager.sendOffer(offer, roomId, from)
        }
        if(messageJson.type == "answer"){
            const answer = messageJson.answer
            const roomId = messageJson.roomId
            const from = messageJson.from
            rtcManager.sendAnswer(answer, roomId, from)
        }
    })
    
})