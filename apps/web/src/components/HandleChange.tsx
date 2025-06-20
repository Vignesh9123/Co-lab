import { useAuthStore } from "@/zustand/auth"
import { useSocketStore } from "@/zustand/socket"
import { useEffect } from "react"
import { useEditor } from "tldraw"
function HandleChange (){
    const editor = useEditor()
    const {socket, setSocket} = useSocketStore()
    const {user} = useAuthStore()

    useEffect(()=>{
        if(!socket){
            const sck = new WebSocket("ws://localhost:8000")
            setSocket(sck)
        }
    }, [socket])
    useEffect(()=>{
        if(!socket) {
            console.log("No socket unbd")
            return
        }

        socket.onopen = ()=>{
            console.log("Socket open")
            socket.send(JSON.stringify({
                type: 'join-room',
                roomId: '1',
                from: user?.id
              }));
        }

        socket.onmessage = (m)=>{
            console.log("Message from room", m.data)
            const message = JSON.parse(m.data)
            if(message.type == "DRAW"){
                editor.createShape({...message.shape, id:"shape:FromServer"}) // TODO: A unique id for each shape
            }
        }

        
    },[socket])
    useEffect(()=>{
        if(editor){
            editor.store.listen(update=>{
                if(Object.keys(update.changes.added).length > 0){
                    console.log("Something added", update.changes.added)

                        console.log("Hola scoker")
                        if(Object.values(update.changes.added)[0].id == "shape:FromServer") return
                        const data = {
                            type:"DRAW",
                            room:"1",
                            shape: {...Object.values(update.changes.added)[0], id:undefined,parentId:undefined, index: undefined}
                        }

                        socket?.send(JSON.stringify(data))
                    
                    if(!socket){
                        console.log("No socket")
                    }
                }

            })
        }
    }, [editor])
    return <></>

}

export default HandleChange