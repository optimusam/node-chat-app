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
    socket.on('disconnect', () => {
        console.log('User disconnected')
    })
})

server.listen(port, () => console.log(`Server running on port ${port}`));