let socket = io();
let messageForm = document.querySelector("#message-form");
let submit = document.querySelector("#go");
let messageField = document.querySelector("#message-field");
let text = document.querySelector("#text-area");

messageForm.addEventListener('submit', function (e) {
    e.preventDefault();
    socket.emit('createMessage', {
        from: "Anonymous",
        text: text.value
    });
});

socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('newMessage', function (message) {
    messageField.insertAdjacentHTML('beforeend', `<p>${message.text} - ${message.from}</p>`);
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});