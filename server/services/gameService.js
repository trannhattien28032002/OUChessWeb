const cameraMove = (socket, io) => {
    socket.on(`cameraMove`, (data) => {
        socket.broadcast.to(data.roomId).emit(`cameraMoved`, data)
    })
};

const disconnect = (socket, io) => {
    socket.on(`disconnecting`, (data) => {
        console.log(`disconnecting`)
    })
}

const leaveRoom = (socket, io) => {
    socket.on(`leaveRoom`, (data) => {
        console.log(data)
        const playerCount = io.sockets.adapter.rooms.get(data.roomId)?.size || 0;
        if (playerCount === 2) {
            io.sockets.in(data.roomId).emit(`leftRoom`, data.roomId, (ack) => {
                if (ack) {
                    console.log("Gửi 'leftRoom' thành công");
                } else {
                    console.log("Gửi 'leftRoom' không thành công");
                }
            })
            socket.leave(data.roomId);
        }

        if (playerCount === 1) {
            io.sockets.in(data.roomId).emit(`leftRoom`, data.roomId, (ack) => {
                if (ack) {
                    console.log("Gửi 'leftRoom' thành công");
                } else {
                    console.log("Gửi 'leftRoom' không thành công");
                }
            })
            socket.leave(data.roomId);
        }
    })
}

const fetchPlayers = (socket, io) => {
    socket.on(`fetchPlayers`, (data) => {
        const players = io.sockets.adapter.rooms.get(data.roomId)?.size || 0
        io.sockets.in(data.roomId).emit(`playersInRoom`, players)
    })
}

const joinRoom = (socket, io) => {
    socket.on(`joinRoom`, (data) => {
        const { roomId, username, avatar } = data

        const playerCount = io.sockets.adapter.rooms.get(data.roomId)?.size || 0
        if (playerCount === 2) {
            socket.emit(`newError`, `Room is full`)
            return
        }
        socket.join(roomId)
        const props = { roomId, username, playerCount, avatar }
        console.log(props)
        io.sockets.in(roomId).emit(`playerJoined`, props)
    })
}

const makeMove = (socket, io) => {
    socket.on(`makeMove`, (data) => {
        io.sockets.in(data.roomId).emit(`moveMade`, data.movingTo)
    })
}

const resetGame = (socket, io) => {
    socket.on(`resetGame`, (data) => {
        io.sockets.in(data.roomId).emit(`gameReset`, true)
    })
}

const sendMessage = (socket, io) => {
    socket.on(`createdMessage`, (data) => {
        const send = data.message
        io.sockets.in(data.roomId).emit(`newIncomingMessage`, send)
    })
}

const promotePawn = (socket, io) => {
    socket.on(`promotePawn`, (data) => {
        io.sockets.in(data.roomId).emit(`promotedPawn`, data.pieceType)
    })
}

module.exports = {
    cameraMove,
    disconnect,
    leaveRoom,
    fetchPlayers,
    joinRoom,
    makeMove,
    resetGame,
    sendMessage,
    promotePawn
};