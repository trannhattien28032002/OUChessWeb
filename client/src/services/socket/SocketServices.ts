// import type { Color } from "src/share/game/logic/pieces";
// import type { MyServer, MySocket } from "src/config/SocketConfig";
// import { Socket } from "socket.io";

// export type CameraMove = {
//     position: [number, number, number]
//     room: string
//     color: Color
// }

// export const cameraMove = (socket: MySocket, io: MyServer): void => {
//     socket.on(`cameraMove`, (data: CameraMove) => {
//         io.sockets.in(data.room).emit(`cameraMoved`, data);
//     })
// }

// export const disconnect = (socket: MySocket, io: MyServer): void => {
//     socket.on(`disconnecting`, (data) => {
//         console.log(`disconnecting`);
//     })
// }

// export const fetchPlayers = (socket: MySocket, io: MyServer): void => {
//     socket.on(`fetchPlayers`, (data: { room: string }) => {
//         const players = io.sockets.adapter.rooms.get(data.room)?.size || 0
//         io.sockets.in(data.room).emit(`playersInRoom`, players)
//     })
// }

// export const joinRoom = (socket: MySocket, io: MyServer): void => {
//     socket.on(`joinRoom`, (data: JoinRoomClient) => {
//         const { room, username } = data

//         const playerCount = io.sockets.adapter.rooms.get(data.room)?.size || 0
//         if (playerCount === 2) {
//             socket.emit(`newError`, `Room is full`)
//             return
//         }

//         socket.join(room)
//         const color: Color = playerCount === 1 ? `black` : `white`
//         const props: playerJoinedServer = { room, username, color, playerCount }
//         io.sockets.in(room).emit(`playerJoined`, props)
//     })
// }

// export const makeMove = (socket: MySocket, io: MyServer): void => {
//     socket.on(`makeMove`, (data: MakeMoveClient) => {
//         io.sockets.in(data.room).emit(`moveMade`, data.movingTo)
//     })
// }

// export const resetGame = (socket: MySocket, io: MyServer): void => {
//     socket.on(`resetGame`, (data: { room: string }) => {
//         io.sockets.in(data.room).emit(`gameReset`, true)
//     })
// }

// export const sendMessage = (socket: MySocket, io: MyServer): void => {
//     socket.on(`createdMessage`, (data: MessageClient) => {
//         const send: Message = data.message
//         io.sockets.in(data.room).emit(`newIncomingMessage`, send)
//     })
// }

const Example = () => {
    return;
}

export default Example;