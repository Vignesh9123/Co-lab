import WebSocket from "ws"

class RoomManager{
    private roomsToSockets:Record<string, Set<WebSocket>> = {}
    private socketToRoom = new Map<WebSocket, string>() 

    joinRoom(roomId: string, socket: WebSocket){
        console.log("Joining room", roomId, this.roomsToSockets[roomId] ? this.roomsToSockets[roomId].size: 0)
        if(this.roomsToSockets[roomId]){
            this.roomsToSockets[roomId].add(socket)
            console.log("Joined room", roomId, this.roomsToSockets[roomId] ? this.roomsToSockets[roomId].size: 0)
        }
        else{
            this.roomsToSockets[roomId] = new Set()
            this.roomsToSockets[roomId].add(socket)
            console.log("Joined room", roomId, this.roomsToSockets[roomId] ? this.roomsToSockets[roomId].size: 0)
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

    sendMessageToRoom(message: any, roomId:string, socket: WebSocket){ // TODO: Set message type
        if(this.roomsToSockets[roomId] && this.roomsToSockets[roomId].size > 0){
            this.roomsToSockets[roomId].forEach(s=>{
                if(s !== socket){
                    console.log("Sending message to room", roomId, message, 'no of sockets', this.roomsToSockets[roomId].size)
                s.send(JSON.stringify(message), {
                    binary: false
                })
                }
            })
        }
    }

    disconnectFromRoom(socket: WebSocket){
        if(this.socketToRoom.has(socket)){
            const roomId = this.socketToRoom.get(socket)
            console.log("Room id to disconnect from ", roomId)
            if(!roomId) return
            this.socketToRoom.delete(socket)
            if(this.roomsToSockets[roomId].has(socket)){
                this.roomsToSockets[roomId].delete(socket)
                console.log("Socket deleted from room")
            }
        }
    }
}

export const roomManager = new RoomManager()