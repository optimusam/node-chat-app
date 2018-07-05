let socket = io();

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.emit('createMessage', {
    from: "Sameer",
    text: "Gryffin remixes the best!"
});

socket.on('newMessage', (message) => {
    console.log(message);
})

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});