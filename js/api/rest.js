const GET = "GET"
const POST = "POST";

const END_POINT = {
    FIND_FORM_LIST: '/api/sp/form/find',
    FORM_SUBMIT_API: '/api/sp/form/submit',
    UPLOAD_FILE_API: '/api/sp/public/file/upload',
    FIND_ANALYZE_API: '/api/sp/form/analyze',
    USER_VALIDATE_API: '/api/sp/admin/validate',
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
        success: (res) => {
            if (LEVEL == 'dev') console.log(res)
            return res;
        },
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
        success: (res) => {
            if (LEVEL == 'dev') console.log(res)
            return res;
        },
        error:function(e){
            IS_UNAUTHORIZED(e)
            return null;
        }
    });
}

const UPLOAD_FILE_API = (file) => {
    let form = new FormData();
    form.append("file", file);

    return $.ajax({
        url : `${API_SERVER_DOMAIN}${END_POINT.UPLOAD_FILE_API}`,
        method : POST,
        headers: {
            'Authorization': `Bearer ${window.localStorage.getItem("accessToken")}`
        },
        processData : false,
        contentType : false,
        data : form,
        success: (res) => {
            if (LEVEL == 'dev') console.log(res)
            return res;
        },
        error:function(e){
            IS_UNAUTHORIZED(e)
            return null;
        }
    });
}

const USER_VALIDATE_API = () => {

    return $.ajax({
        url : `${API_SERVER_DOMAIN}${END_POINT.USER_VALIDATE_API}`,
        method : GET,
        headers: {
            'Authorization': `Bearer ${window.localStorage.getItem("accessToken")}`
        },
        success: (res) => {
            if (LEVEL == 'dev') console.log(res)
        },
        error:function(e){
            IS_UNAUTHORIZED(e)
        }
    });
}