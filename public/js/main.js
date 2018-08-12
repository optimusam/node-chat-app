let socket = io();
let messageForm = document.querySelector("#message-form");
let submit = document.querySelector("#go");
let messageField = document.querySelector("#message-field");
let text = document.querySelector("#text-area");
let sendLocationBtn = document.querySelector("#send-location");

function scrollToBottom() {
    let messageFieldChildLen = messageField.children.length;
    let newMessage = messageField.children[messageFieldChildLen-1];
    let newMessageInnerHt = newMessage.clientHeight;
    let clienHt = messageField.clientHeight
    let scrollTopHt = messageField.scrollTop
    let scrollHt = messageField.scrollHeight
    messageField.scrollTop = scrollHt + newMessageInnerHt
}
messageForm.addEventListener('submit', function (e) {
    e.preventDefault();
    socket.emit('createMessage', {
        from: "Anonymous",
        text: text.value
    });
    text.value = '';
});

sendLocationBtn.addEventListener('click', function (e) {
    e.preventDefault();
    if('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            console.log(position.coords.latitude, position.coords.longitude);
            let locationLink = `https://www.google.co.in/maps/place/ ${position.coords.latitude},${position.coords.longitude}`;
            socket.emit('createLocation', {
                from: "Admin",
                locationURL: `${locationLink}`
            });
        }, 
        function () {alert('Unable to access location')});
    }
    else {
        alert(`Your browser doesn't have location support!`);
    }
    scrollToBottom()
});

socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('newMessage', function (message) {
    messageField.insertAdjacentHTML('beforeend', `<div><p>${message.from}: ${message.text}</p></div>`);
    scrollToBottom();
});

socket.on('newLocation', function (locationInfo) {
    messageField.insertAdjacentHTML('beforeend', `<div><p>${locationInfo.from}: <a href='${locationInfo.locationURL}' target='_blank'>User has shared his location</a></div>`);
    scrollToBottom();
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});