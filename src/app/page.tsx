'use client'

import { ReplyIcon } from "@/icons";
import { Chat } from "@/lib/types";
import { socket } from "@/socket";
import { useEffect, useState } from "react";

const selfId = 1

export default function Home() {
    const [chats, setChats] = useState<Chat[]>([])
    const [text, setText] = useState("")
    const [repliedChat, setRepliedChat] = useState<Chat | null>(null)
    
    function send() {
        socket.emit('chat', {
            id: 0,
            userId: 1,
            userName: "Si React",
            message: text,
            date: new Date(),
            replyChatId: repliedChat?.id,
        } satisfies Chat)
        
        setText("")
        setRepliedChat(null)
    }
    
    function reply(chat: Chat) {
        setRepliedChat(chat)
    }

    function cancelReply() {
        setRepliedChat(null)
    }

    function getChatById(id: number): Chat | undefined {
        return chats.find(x => x.id === id)
    }
    
    useEffect(() => {
        socket.emit('get-chats', (chats: Chat[]) => {
            setChats(chats)
        })
        
        socket.on('chat', (chat: Chat) => {
            setChats((chats) => [
                ...chats,
                chat,
            ])
        })
    }, [])
    
    return <div className="bg-gray-200 h-full flex flex-col">
        <div className="flex-1 p-4 flex flex-col">
            {chats.map((chat, index) => (
                chat.userId === selfId ? (
                    <div
                        key={index}
                        className="bg-emerald-300 my-1 p-3 rounded-lg flex flex-col self-end ml-8 group relative"
                    >
                        <span className="text-sm text-gray-700 mr-6">Kamu</span>
                        { chat.replyChatId ? (
                            <div className="bg-white/30 px-2 py-1 text-sm my-1">
                                { getChatById(chat.replyChatId)?.message }
                            </div>
                        ) : null }
                        <span>{ chat.message }</span>
                
                        <button
                            className="absolute right-2 top-2 hidden group-hover:block"
                            onClick={() => reply(chat)}
                        >
                            <ReplyIcon className="w-4 h-4" color="#666666"/>
                        </button>
                    </div>
                ) : (
                    <div
                        key={index}
                        className="bg-white my-1 p-3 rounded-lg flex flex-col self-start mr-8 group relative"
                    >
                        <span className="text-sm text-gray-700 mr-6">{ chat.userName }</span>
                        { chat.replyChatId ? (
                            <div className="bg-black/10 px-2 py-1 text-sm my-1">
                                { getChatById(chat.replyChatId)?.message }
                            </div>
                        ) : null }
                        <span>{ chat.message }</span>
                
                        <button
                            className="absolute right-2 top-2 hidden group-hover:block"
                            onClick={() => reply(chat)}
                        >
                            <ReplyIcon className="w-4 h-4" color="#BBBBBB"/>
                        </button>
                    </div>
                )
            ))}
        </div>
        <div>
            {repliedChat ? (
                <div className="p-3 bg-black/10 flex flex-col rounded-t-lg relative">
                    <span className="text-xs">{ repliedChat.userName }</span>
                    <span className="text-sm">{ repliedChat.message }</span>
                    
                    <button
                        className="absolute right-3 top-1 text-gray-500"
                        onClick={cancelReply}
                    >x</button>
                </div>
            ) : null}
            
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
    </div>
}
