let logout;
let form_list_api;
let page = 0;
let type = 99;


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

    form_list_api = () => {
        $.ajax({
            url : 'http://formdang-api.com/api/sp/form/find',
            method : 'GET',
            headers: {'Authorization': `"Bearer ${window.localStorage.getItem("accessToken")}`},
            xhrFields: { // CORS 문제 우회해서 헤더 넘겨주기
                withCredentials: true
            },
            data: {
                page: page,
                type: type
            },
            success: (res) => {
                console.log(res)
            },
            error:function(error,status,msg){
                console.log("상태코드 " + status + "에러메시지" + msg );
            }
        });
    }

})

$(window).load(() => {

    const isLogin = () => {
        if (!window.localStorage.getItem('accessToken')) {
            alert('로그인을 해주세요.')
            window.location.replace('https://formdang.com/')
        }
    }

    isLogin();

    form_list_api();

})