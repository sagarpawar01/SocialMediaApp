const io = require("socket.io")(8900,{
    cors : {
        origin : "https://breakable-tuna-helmet.cyclic.app/images"
    }
})

let users = []

const getUser = (userId) => {
    return users.find((user) => user.userId === userId)
}

const addUser = (userId,socketId) => {
    !users.some((user) => user.userId === userId) && users.push({userId,socketId})
}

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId)
}

io.on("connection",(socket) => {
    console.log("A user connected")
    socket.on("addUser",userId=>{
        addUser(userId,socket.id)
        io.emit("getUsers",users)
    })

    socket.on("sendMessage",({senderId,receiverId,text}) => {
        const user = getUser(receiverId)
        io.to(user.socketId).emit("getMessage",{
            senderId,
            text,
        })
    })

    socket.on("disconnect",() => {
        console.log("A user disconnected");
        removeUser(socket.id)
        io.emit("getUsers",users)
    })
})