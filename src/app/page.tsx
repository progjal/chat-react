'use client'

import { Chat } from "@/lib/types";
import { socket } from "@/socket";
import { useEffect, useState } from "react";

const selfId = "1"

export default function Home() {
    const [chats, setChats] = useState<Chat[]>([])
    console.log("Atas", chats)
    
    const [text, setText] = useState("")
    
    function send() {
        socket.emit('chat', {
            id: "0",
            userId: "1",
            userName: "Si React",
            message: text,
            date: new Date(),
        })
        
        setText("")
    }
    
    useEffect(() => {
        socket.on('chat', (chat: Chat) => {
            setChats([
                ...chats,
                chat,
            ])
        })
    }, [])
    
    return <div className="bg-red-400 h-full flex flex-col">
        <div className="flex-1 bg-gray-200 p-4 flex flex-col">
            {chats.map((chat, index) => (
                chat.userId === selfId ? (
                    <div
                        key={index}
                        className="bg-emerald-300 my-1 p-3 rounded-lg flex flex-col self-end ml-8"
                    >
                        <span className="text-sm text-gray-700">Kamu</span>
                        <span>{ chat.message }</span>
                    </div>
                ) : (
                    <div
                        key={index}
                        className="bg-white my-1 p-3 rounded-lg flex flex-col self-start mr-8"
                    >
                        <span className="text-sm text-gray-700">{ chat.userName }</span>
                        <span>{ chat.message }</span>
                    </div>
                )
            ))}
        </div>
        <div className="flex">
            <input
                className="flex-1 p-2 outline-none"
                type="text"
                value={text}
                onChange={(v) => setText(v.target.value)}
            />
            
            <button
                onClick={send}
                className="bg-blue-500 px-3 text-white"
            >
                Send
            </button>
        </div>
    </div>
}
