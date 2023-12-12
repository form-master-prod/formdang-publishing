$(document).ready(() => {
    const searchParams = new URLSearchParams(location.search);

    for (const param of searchParams) {
        let key = param[0];
        let value = param[1];
        if (key == 'accessToken') window.localStorage.setItem(key, value)
        else if (key =='refreshToken') window.localStorage.setItem(key, value)
    }


})

$(window).load(() => {
    console.log(window.localStorage.getItem('accessToken'))
    console.log(window.localStorage.getItem('refreshToken'))
})