function findRooms() {
    $('#greetings').empty()
    $.ajax({
        url: PAGE.CHAT.FIND,
        method: "GET",
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        success: function (r){
            const channels = r.channels
            for (let v of  channels) {
                $('#greetings').append(`<div>${v}번방<button class="btn btn-default" type="button" onclick="move(${v})">이동</button></div>`)
            }
        },
        error: function (e) {
            console.log(e)
        }
    })
}

function createRoom() {
    const channel = document.getElementById('channel').value;
    const data = JSON.stringify({
        channel: channel
    })

    $.ajax({
        url:  PAGE.CHAT.CREATE,
        method: 'POST',
        data: data,
        contentType: 'application/json',
        success: function (r) {
            findRooms()
        },
        error: function (e) {
            console.log(e)
        }
    })
}

function move(channel) {
    location.href = PAGE.CHAT.ROOM + "?channel=" + channel
}

$(document).ready(function () {
    findRooms();
})