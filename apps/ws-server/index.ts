import { WebSocketServer } from "ws";
import { roomManager } from "./RoomManager";
import { rtcManager } from "./RTCManager";
import { saveMessageToDB } from "./utils";
const server = new WebSocketServer({
    port: Number(process.env.PORT || 8000)
})

interface MessageJSON {
    type: "message" | "offer" | "answer" | "iceCandidate";
    data: string;
    from: string;
    roomId: string;
    offer: RTCSessionDescription;
    answer: RTCSessionDescription;
    iceCandidate: RTCIceCandidate;
}

server.on('connection', (socket)=>{
    // TODO: Add a middleware to check if the user is authenticated
    console.log("Hey somebody joined")
    socket.on('message', async(m)=>{
        const messageJson:MessageJSON = JSON.parse(m.toString())
        if(messageJson.type == "message"){
            // TODO: Send a indicator to the other user that a message is being sent
            // TODO: Validate the message and check if the user is in the room
            await saveMessageToDB(messageJson.data, messageJson.from, messageJson.roomId)
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
        if(messageJson.type == "iceCandidate"){
            const iceCandidate = messageJson.iceCandidate
            const roomId = messageJson.roomId
            const from = messageJson.from
            rtcManager.sendIceCandidate(iceCandidate, roomId, from)
        }
    })
    
})