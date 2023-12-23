const GET = "GET"
const POST = "POST";

const END_POINT = {
    FIND_FORM_LIST: '/api/sp/form/find',
    FORM_SUBMIT_API: '/api/sp/form/submit'
}

const IS_UNAUTHORIZED = (e) => {
    if (e && e.status == 401) {
        alert('로그아웃 되었습니다. 다시 로그인해주세요.')
        window.location.replace(PAGE.LOGIN.MY)
    }
}

const FORM_LIST_API = (jsonData) => {

    return $.ajax({
        url : `${API_SERVER_DOMAIN}${END_POINT.FIND_FORM_LIST}`,
        method : GET,
        headers: {
            'Authorization': `Bearer ${window.localStorage.getItem("accessToken")}`
        },
        data: jsonData,
        success: (res) => { return res; },
        error:function(e){
            IS_UNAUTHORIZED(e)
            return null;
        }
    });
}

const FORM_SUBMIT_API = (jsonData) => {

    return $.ajax({
        url : `${API_SERVER_DOMAIN}${END_POINT.FORM_SUBMIT_API}`,
        method : POST,
        headers: {
            'Authorization': `Bearer ${window.localStorage.getItem("accessToken")}`
        },
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(jsonData),
        success: (res) => { return res; },
        error:function(e){
            IS_UNAUTHORIZED(e)
            return null;
        }
    });
}
