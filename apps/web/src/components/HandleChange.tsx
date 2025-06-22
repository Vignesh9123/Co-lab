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
                editor.createShape({...message.shape, id:message.shape.id as TLShapeId, meta:{fromServer: true}}) // TODO: A unique id for each shape

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
        if(editor){
            editor.store.listen(update=>{
                if(Object.entries(update.changes.updated).filter(s=> s[0].includes("shape")).length > 0){
                    console.log("Something added", Object.entries(update.changes.updated).filter(s=> s[0].includes("shape"))[0][1][Object.entries(update.changes.updated).filter(s=> s[0].includes("shape"))[0][1].length - 1] )

                        console.log("Hola scoker")
                        console.log("From server", Object.keys( Object.entries(update.changes.updated).filter(s=> s[0].includes("shape"))[0][1][Object.entries(update.changes.updated).filter(s=> s[0].includes("shape"))[0][1].length - 1]?.meta).includes("fromServer"))
                        if(Object.keys( Object.entries(update.changes.updated).filter(s=> s[0].includes("shape"))[0][1][Object.entries(update.changes.updated).filter(s=> s[0].includes("shape"))[0][1].length - 1]?.meta).includes("fromServer")) return
                        const data = {
                            type:"DRAW",
                            room:"1",
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

            })
        }
    }, [editor, socket])
    return <></>

}

export default HandleChange