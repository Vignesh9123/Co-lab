import { WebSocket } from "ws";
import { roomManager } from "./RoomManager";
class RTCManager{
    sendOffer(offer:any, toRoom: string, from: string, socket: WebSocket){
        const message = {
            type: "offer",
            offer,
            from
        }
        roomManager.sendMessageToRoom(message, toRoom, socket)
    }

    sendAnswer(answer: any, toRoom: string, from: string, socket: WebSocket){
        const message = {
            type: "answer",
            answer,
            from
        }
        roomManager.sendMessageToRoom(message, toRoom, socket)
    }
    sendIceCandidate(iceCandidate: any, toRoom: string, from: string, socket: WebSocket){
        const message = {
            type: "iceCandidate",
            iceCandidate,
            from
        }
        roomManager.sendMessageToRoom(message, toRoom, socket)
    }
}

export const rtcManager = new RTCManager()