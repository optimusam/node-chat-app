const path = require("path");
const publicPath = path.join(__dirname, "../public");
const express = require("express");
const app = express();
const http = require("http");
const socketIO =require("socket.io");

let server = http.createServer(app);
let io = socketIO(server);
let port = process.env.PORT || 3000;

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New User Connected');

    socket.emit('newMessage', {
        from: "Welcome Bot!",
        text: "Welcome to chat app!"
    });
    socket.broadcast.emit('newMessage', {
        from: "Welcome Bot!",
        text: "New User joined!"
    });

    socket.on('createMessage', (message) => {
        io.emit('newMessage', {
                from: message.from,
                text: message.text,
                createdAt: new Date().toTimeString()
            });
    });


    socket.on('disconnect', () => {
        console.log('User disconnected')
    });
});

server.listen(port, () => console.log(`Server running on port ${port}`));