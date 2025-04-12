import WebSocket from "ws"

class RoomManager{
    private roomsToSockets:Record<string, Set<WebSocket>> = {}
    private socketToRoom = new Map<WebSocket, string>() 

    joinRoom(roomId: string, socket: WebSocket){
        if(this.roomsToSockets[roomId]){
            this.roomsToSockets[roomId].add(socket)
        }
        else{
            this.roomsToSockets[roomId] = new Set()
            this.roomsToSockets[roomId].add(socket)
        }
        this.socketToRoom.set(socket, roomId)
    }

    removeFromRoom(roomId: string, socket: WebSocket){
        if(this.roomsToSockets[roomId] && this.roomsToSockets[roomId].has(socket)){
            this.roomsToSockets[roomId].delete(socket)

            if(this.socketToRoom.has(socket)){
                this.socketToRoom.delete(socket)
            }
        }
    }

    sendMessageToRoom(message: any, roomId:string){ // TODO: Set message type
        if(this.roomsToSockets[roomId] && this.roomsToSockets[roomId].size > 0){
            this.roomsToSockets[roomId].forEach(s=>{
                s.send(message, {
                    binary: false
                })
            })
        }
    }

    

    

}