import { roomManager } from "./RoomManager";
class RTCManager{
    sendOffer(offer:any, toRoom: string, from: string){
        const message = {
            type: "offer",
            offer,
            from
        }
        roomManager.sendMessageToRoom(message, toRoom)
    }

    sendAnswer(answer: any, toRoom: string, from: string){
        const message = {
            type: "answer",
            answer,
            from
        }
        roomManager.sendMessageToRoom(message, toRoom)
    }
    sendIceCandidate(iceCandidate: any, toRoom: string, from: string){
        const message = {
            type: "iceCandidate",
            iceCandidate,
            from
        }
        roomManager.sendMessageToRoom(message, toRoom)
    }
}

export const rtcManager = new RTCManager()