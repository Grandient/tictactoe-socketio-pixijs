const express = require('express');
const http = require('http');
const path = require('path');
const moment = require('moment');
const socketio = require('socket.io');

const {User} = require('./user');
const {Room} = require('./room');
const {ServerControl} = require('./server');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = 3000 || process.env.PORT;

var serverControl = new ServerControl();

io.on('connection', socket => {
    socket.on("join", ({username, roomName}) => {
        let clientName = username;
        let clientId = socket.conn.id;
        let lastUpdate = moment().format('h:mm a');
        let user = new User(clientName, clientId, lastUpdate, socket);
        
        let clientCheck = serverControl.addClient(user);
        if(!clientCheck){
            socket.emit('errorMessage', "Client with name { " + user.clientName + " } is already in the game!")
            socket.emit('message', "Disconnected from server. (Server)")
            socket.disconnect();
        }

        // Add room
        if(serverControl.hasRoom("roomName")){
            socket.emit("message", "Found room!")
        } else {
            let room = new Room(roomName);
            serverControl.addRoom(room);
            socket.emit("message", "Created room!")
        }

        // Add user to room
        let room = serverControl.getRoom(roomName);
        room.addUser(user);

        // Join room with id
        socket.join(room.roomName)
        
        // Room join message.
        socket.emit('message', 'You have joined room ' + room.roomName + ' with id {' + user.clientId + "} and username {" + user.clientName +"}")

        // Client initialization.
        socket.emit('init', {clientId: user.clientId, roomName: user.roomName, lastUpdate: user.lastUpdate})

        // Game start message.
        socket.broadcast.to(room.roomName).emit('message', user.clientName + " { " + user.clientId + " } has joined the game.")

        // Listings
        socket.on("userList", () => {
            socket.emit("userList", serverControl.clientList)
        })

        socket.on("roomList", () => {
            socket.emit("roomList", serverControl.roomList)
        })

        if(room.game.O != null){
            socket.broadcast.to(room.roomName).emit("O", room.game.O.clientName)
        }

        if(room.game.X != null){
            socket.broadcast.to(room.roomName).emit("X", room.game.X.clientName)
        }

        // Game
        // Set player type
        socket.on("type", (type) => {
            if(type === "X" && room.game.X === null){
                room.game.setX(user);
                socket.emit("type", "X")
                socket.emit("state", room.game.state)
                socket.broadcast.to(room.roomName).emit("state", room.game.state)
                socket.broadcast.to(room.roomName).emit("X", user.clientName)
            } else if(type === "O" && room.game.O === null) {
                room.game.setO(user);
                socket.emit("type", "O")
                socket.emit("state", room.game.state)
                socket.broadcast.to(room.roomName).emit("state", room.game.state)
                socket.broadcast.to(room.roomName).emit("O", user.clientName)
            } else {
                socket.emit("errorMessage", "Invalid type or type already has player.")
            }
        })

        // A player move
        socket.on("move", ({x, y}) => {
            if(room.game.ready()){
                room.game.place(user, x, y, room);
            } else {
                socket.emit("errorMessage", "Missing other player or you have not selected a type.")
            }
        })

        socket.on("reset", () => {
            room.game.start();
            client.socket.emit("state", this.state)
            client.socket.broadcast.to(room.roomName).emit("state", this.state)
        })

        // Disconnect
        socket.on('disconnect', () =>{
            serverControl.removeClient(user);
            serverControl.removeRoom(room)
            io.emit('message', user.clientName + " { " + user.clientId + " } has left the game.")
        })
    })
})

//app.use(express.static(path.join(__dirname, 'public')))
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))