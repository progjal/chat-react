'use client'

import { socket } from "@/socket";
import { useEffect, useState } from "react";

export default function Home() {
    const [message, setMessage] = useState("AWAL")
    
    useEffect(() => {
        function onMessage(msg: string) {
            console.log(`Messages : "${msg}"`)
            setMessage(msg)
        }
        
        socket.on('message', onMessage)
                
        return () => {
            socket.off('message', onMessage)
        }
    }, [])
    
    return <div>REACT {message}</div>;
}
