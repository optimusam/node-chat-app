let socket = io();
let messageForm = document.querySelector("#message-form");
let submit = document.querySelector("#go");
let messageField = document.querySelector("#message-field");
let text = document.querySelector("#text-area");
let sendLocationBtn = document.querySelector("#send-location");
let peopleList = document.querySelector("#users")
let count = document.querySelector("#count")
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
    if(text.value) {
        socket.emit('createMessage', {
            text: text.value
        });
    } 
    text.value = '';
});

sendLocationBtn.addEventListener('click', function (e) {
    e.preventDefault();
    if('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            let locationLink = `https://www.google.co.in/maps/place/ ${position.coords.latitude},${position.coords.longitude}`;
            socket.emit('createLocation', {
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
    let params = deparam(location.search)
    socket.emit('join', params, function(err) {
        if(err) {
            alert(err)
            window.location.href = '/'
        }
        else {
            console.log('No errors.')
        }
    })
});

socket.on('newMessage', function (message) {
    messageField.insertAdjacentHTML('beforeend', `<div><p>${message.from}: ${message.text}</p></div>`);
    scrollToBottom();
});

socket.on('newLocation', function (locationInfo) {
    messageField.insertAdjacentHTML('beforeend', `<div><p>${locationInfo.from}: <a href='${locationInfo.locationURL}' target='_blank'>Here's my location!</a></div>`);
    scrollToBottom();
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('updateUserList', function(users) {
    peopleList.textContent = ''
    count.textContent = users.length
    users.map(name => {
        peopleList.insertAdjacentHTML('beforeend', `<li>${name}</li>`)
    })
})