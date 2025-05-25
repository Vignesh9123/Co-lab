import { WebSocketServer } from "ws";
import { roomManager } from "./RoomManager";
import { rtcManager } from "./RTCManager";
import { saveMessageToDB } from "./utils";
const server = new WebSocketServer({
    port: Number(process.env.PORT || 8000)
})

interface MessageJSON {
    type: "message" | "offer" | "answer" | "iceCandidate" | "join-room" | "leave-room" | "code";
    data: string;
    from: string;
    roomId: string;
    offer: any;
    answer: any;
    iceCandidate: any;
}

server.on('listening', ()=>{
    console.log(`Server is running on port ${process.env.PORT || 8000}`)
})

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
            roomManager.sendMessageToRoom(message, roomId, socket)
        }
        if(messageJson.type == "join-room"){
            console.log("Hey somebody joined room", messageJson)
            const roomId = messageJson.roomId
            roomManager.joinRoom(roomId, socket)
        }
        if(messageJson.type == "leave-room"){
            const roomId = messageJson.roomId
            roomManager.removeFromRoom(roomId, socket)
        }
        if(messageJson.type == "offer"){
            const offer = messageJson.offer
            const roomId = messageJson.roomId
            const from = messageJson.from
            rtcManager.sendOffer(offer, roomId, from, socket)
        }
        if(messageJson.type == "answer"){
            const answer = messageJson.answer
            const roomId = messageJson.roomId
            const from = messageJson.from
            rtcManager.sendAnswer(answer, roomId, from, socket)
        }
        if(messageJson.type == "iceCandidate"){
            const iceCandidate = messageJson.iceCandidate
            const roomId = messageJson.roomId
            const from = messageJson.from
            rtcManager.sendIceCandidate(iceCandidate, roomId, from, socket)
        }
        if(messageJson.type == "code"){
            console.log('m', messageJson)
            roomManager.disconnectFromRoom(socket)
            roomManager.sendMessageToRoom(messageJson,'1', socket)
        }
    })

    socket.on('close', ()=>{
        console.log("Hey somebody left")
        roomManager.disconnectFromRoom(socket)
    })
    
})