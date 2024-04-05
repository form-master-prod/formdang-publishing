const name = generateRandomString()
let channel

let websocket;

class Msg {
    channel
    name
    msg
    constructor(channel, name, msg) {
        this.channel = channel;
        this.name = name;
        this.msg = msg;
    }
}

function connect() {
    websocket = new SockJS(`${PAGE.CHAT.SOCKET}?channel=${channel}&name=${name}`);

    websocket.onmessage = onmessage;
    websocket.onerror = onerror;
    websocket.onclose = function () {
        window.history.back();
    };

    setConnected(true)
}

function onmessage(msg) {
    const data = JSON.parse(msg.data)

    $("#greetings").append("<tr><td>" + `[${data.name}] ` +  data.msg + "</td></tr>");
}

function onerror(e) {
    console.log(e)
    setConnected(false)
}

function send() {
    console.log(name)
    websocket.send(JSON.stringify(new Msg(channel, name, document.getElementById('content').value)));
    document.getElementById('content').value = '';
}

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) $("#conversation").show();
    else $("#conversation").hide();
    $("#greetings").html("");
}


function generateRandomString(){
    const num = Math.ceil(Math.random() * 1000);
    return "USER" + num;
}

$(document).ready(function () {
    const param = new URLSearchParams(window.location.search)
    channel = param.get('channel')
    connect();
})
