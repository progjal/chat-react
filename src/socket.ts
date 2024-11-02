"use client"

import { io } from "socket.io-client";
console.log("SOCKET")
export const socket = io("http://localhost:3003")