let socket = io();
let messageForm = document.querySelector("#message-form");
let submit = document.querySelector("#go");
let messageField = document.querySelector("#message-field");
let text = document.querySelector("#text-area");
let sendLocationBtn = document.querySelector("#send-location");

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
    let ua = navigator.userAgent.toLowerCase(),
    isAndroid = ua.indexOf("android") > -1,
    geoTimeout = isAndroid ? '15000' : '1000';
    if('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            let locationLink = `https://www.google.co.in/maps/place/ ${position.coords.latitude},${position.coords.longitude}`;
            socket.emit('createLocation', {
                from: "Admin",
                locationURL: `${locationLink}`
            });
        }, function () {alert('Unable to access location')},
         {enableHighAccuracy: true, maximumAge: 3000, timeout:geoTimeout});
    }
});

socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('newMessage', function (message) {
    messageField.insertAdjacentHTML('beforeend', `<p>${message.from}: ${message.text}</p>`);
});

socket.on('newLocation', function (locationInfo) {
    messageField.insertAdjacentHTML('beforeend', `<p>${locationInfo.from}: <a href='${locationInfo.locationURL}' target='_blank'>User has shared his location</a>`);
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});