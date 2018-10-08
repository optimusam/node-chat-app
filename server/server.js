const path = require("path");
const publicPath = path.join(__dirname, "../public");
const express = require("express");
const app = express();
const http = require("http");
const socketIO =require("socket.io");
const genMessage = require("./utils/message");
const genLocation = require('./utils/location');
const {isRealString} = require('./utils/realString')
const {Users} = require('./utils/users')
let server = http.createServer(app);
let io = socketIO(server);
let port = process.env.PORT || 3000;
let users = new Users();
app.use(express.static(publicPath));

io.on('connection', (socket) => {
    socket.on('join' , function(params, callback) {
        if(!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Your name or room is invalid.')
        }
        socket.join(params.room)
        users.removeUser(socket.id)
        users.addUser(socket.id, params.name, params.room)
        socket.emit('newMessage', genMessage('Chatter Bot🤖', 'Welcome to the chat room!'));
        socket.broadcast.to(params.room).emit('newMessage', genMessage('Chatter Bot🤖', `⚡️${params.name} has joined!⚡`));
        io.to(params.room).emit('updateUserList', users.getUserList(params.room))
        callback();
    })

    socket.on('createMessage', (message) => {
        let user = users.getUser(socket.id)
        io.to(user.room).emit('newMessage', genMessage(user.name, message.text));
    });

    socket.on('createLocation', ({locationURL}) => {
        let user = users.getUser(socket.id)
        io.to(user.room).emit('newLocation', genLocation(user.name, locationURL));
    })
    
    socket.on('disconnect', () => {
        let user = users.removeUser(socket.id)
        if(user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room))
            io.to(user.room).emit('newMessage', { from: 'Chatter Bot🤖', text: `${user.name} has left the chat.`})
        }
    });
});

server.listen(port, () => console.log(`Server running on port ${port}`));