let logout;

$(document).ready(() => {
    $('.layer-sel').niceSelect();

    const searchParams = new URLSearchParams(location.search);

    for (const param of searchParams) {
        let key = param[0];
        let value = param[1];
        if (key == 'accessToken') window.localStorage.setItem(key, value)
        else if (key =='refreshToken') window.localStorage.setItem(key, value)
    }

    logout = () => {
        window.localStorage.removeItem('accessToken')
        window.localStorage.removeItem('refreshToken')
        window.location.replace('https://formdang.com/')
    }

})

$(window).load(() => {

    const isLogin = () => {
        if (!window.localStorage.getItem('accessToken')) {
            alert('로그인을 해주세요.')
            // window.location.replace('https://formdang.com/')
        }
    }

    isLogin();

})