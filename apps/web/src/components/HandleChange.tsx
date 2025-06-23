import { useAuthStore } from "@/zustand/auth"
import { useSocketStore } from "@/zustand/socket"
import { useEffect } from "react"
import { TLShapeId, useEditor } from "tldraw"
function HandleChange (){
    const editor = useEditor()
    const socket = useSocketStore((state) => state.socket);
  const setSocket = useSocketStore((state) => state.setSocket);
    const {user} = useAuthStore()
    
    const connectSocket = () => {
        console.log("Connecting to socket...");
        const ws = new WebSocket('ws://localhost:8000');
        setSocket(ws);
      };

    useEffect(()=>{
        if(!socket){
            connectSocket()
        }
        return ()=>{
            socket?.close()
        }
    }, [])
   
    useEffect(() => {
        if (!socket) {
        console.log("Socket became null")            
    return
};
    console.log("Socket not null")
        socket.onopen = () => {
          console.log('socket opened');
          socket.send(JSON.stringify({
            type: 'join-room',
            roomId: '1',
            from: user?.id
          }));
        };
    
        socket.onmessage = (m)=>{
            console.log("Message from room", m.data)
            const message = JSON.parse(m.data)
            if(message.type == "DRAW"){
                if(message.drawType == "addShape"){
                    editor.createShape({...message.shape, id:message.shape.id as TLShapeId, meta:{fromServer: true}}) 
                }
                if(message.drawType == "deleteShape"){
                    if(editor.getShape(message.shapeId as TLShapeId)){
                        editor.deleteShape(message.shapeId as TLShapeId)
                    }
                }
            }
        }
        socket.onclose = () => {
          console.log('socket closed');
        };
    
        socket.onerror = (err) => {
          console.log('Socket error', err);
          socket.close(); 
        };
      }, [socket]);
    useEffect(()=>{
        // TODO: Not adding duplicate shapes
        if(editor){
            editor.store.listen(update=>{
                // console.log(update)
                if(Object.entries(update.changes.updated).filter(s=> s[0].includes("shape")).length > 0){
                    console.log("Something added", Object.entries(update.changes.updated).filter(s=> s[0].includes("shape"))[0][1][Object.entries(update.changes.updated).filter(s=> s[0].includes("shape"))[0][1].length - 1] )

                        console.log("Hola scoker")
                        console.log("From server", Object.keys( Object.entries(update.changes.updated).filter(s=> s[0].includes("shape"))[0][1][Object.entries(update.changes.updated).filter(s=> s[0].includes("shape"))[0][1].length - 1]?.meta).includes("fromServer"))
                        if(Object.keys( Object.entries(update.changes.updated).filter(s=> s[0].includes("shape"))[0][1][Object.entries(update.changes.updated).filter(s=> s[0].includes("shape"))[0][1].length - 1]?.meta).includes("fromServer")) return
                        const data = {
                            type:"DRAW",
                            room:"1",
                            drawType:"addShape",
                            shape: {...Object.entries(update.changes.updated).filter(s=> s[0].includes("shape"))[0][1][Object.entries(update.changes.updated).filter(s=> s[0].includes("shape"))[0][1].length - 1],parentId:undefined, index: undefined}
                        }

                        
                        if(!socket){
                            console.log("No socket")
                        //     const sck = new WebSocket("ws://localhost:8000")
                        //     setSocket(sck)
                        return;
                        }
                        socket.send(JSON.stringify(data))
                }
                if(Object.entries(update.changes.added).filter(s=> s[0].includes("shape")).length > 0){
                    console.log("Something added in real", Object.values(update.changes.added)[0] )

                        console.log("Hola scoker")
                        console.log("From server",Object.keys(Object.values(update.changes.added)[0].meta).includes("fromServer"))
                        if(Object.keys(Object.values(update.changes.added)[0].meta).includes("fromServer")) return
                        const data = {
                            type:"DRAW",
                            room:"1",
                            drawType:"addShape",
                            shape: {...Object.values(update.changes.added)[0],parentId:undefined, index: undefined}
                        }
                        console.log("Dup data", data)

                        
                        if(!socket){
                            console.log("No socket")
                        //     const sck = new WebSocket("ws://localhost:8000")
                        //     setSocket(sck)
                        return;
                        }
                        socket.send(JSON.stringify(data))
                }
                if(Object.entries(update.changes.removed).length > 0){
                    console.log("Removed", Object.values(update.changes.removed)[0].id)
                    const data = {
                        type:"DRAW",
                        drawType: "deleteShape",
                        room: "1",
                        shapeId: Object.values(update.changes.removed)[0].id
                    }
                    if(!socket) return
                    socket.send(JSON.stringify(data))
                }

            })
        }
    }, [editor, socket])
    return <></>

}

export default HandleChange