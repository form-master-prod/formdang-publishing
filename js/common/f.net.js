// REST 상수
const UNAUTHORIZED_STATUS = 401; // 401 상태 오류 상수
const GET = "GET" // GET 상수
const POST = "POST"; // POST 상수
const SP_API_PREFIX = "/api/sp"; // 스프링 API prefix (해당 prefix에 따라 nginx에서 revers proxy 처리)
const JSON_CONTENT_TYPE = "application/json; charset=utf-8";
const END_POINT = {
    FIND_FORM_LIST: concatPrefix('/form/find'), // 폼 리스트 조회 uri
    FORM_SUBMIT_API: concatPrefix('/form/submit'), // 폼 제출 uri
    UPLOAD_FILE_API: concatPrefix('/public/file/upload'), // 파일 업로드 uri
    USER_VALIDATE_API: concatPrefix('/admin/validate'), // 토큰 유효성 검사 uri
}

function concatPrefix(uri) { return SP_API_PREFIX + uri } // 스프링 API prefix 생성 함수
function getToken() { return { 'Authorization': `Bearer ${window.localStorage.getItem("accessToken")}` } } // 헤더 토큰 적용 함수

function FORM_LIST_API(d) { // 폼 리스트 조회
    return $.ajax({
        url : getApiURL(END_POINT.FIND_FORM_LIST),
        method : GET,
        headers: {...getToken()},
        data: d,
        success: function (r) {
            if (!isProduction()) console.log(r) // 개발 환경 콘솔 처리
            return r;
        },
        error:function(e){
            return IS_UNAUTHORIZED(e);
        }
    });
}

function FORM_SUBMIT_API(d) { // 폼 제출
    return $.ajax({
        url : getApiURL(END_POINT.FORM_SUBMIT_API),
        method : POST,
        headers: {...getToken()},
        contentType: JSON_CONTENT_TYPE, // json body 처리
        data : JSON.stringify(d),
        success: function (r) {
            if (!isProduction()) console.log(r) // 개발 환경 콘솔 처리
            return r;
        },
        error:function(e){
            return IS_UNAUTHORIZED(e);
        }
    });
}

function UPLOAD_FILE_API(d) { // 파일 업로드
    if (!(d instanceof FormData)) {
        return null;
    }

    return $.ajax({
        url : getApiURL(END_POINT.UPLOAD_FILE_API),
        method : POST,
        headers: {...getToken()},
        processData : false, // query string 형태 파일전송 false 처리 (파일전송처리)
        contentType : false,
        data : d,
        success: function(r) {
            if (!isProduction()) console.log(r) // 개발 환경 콘솔 처리
            return r;
        },
        error:function(e){
            return IS_UNAUTHORIZED(e);
        }
    });
}

function USER_VALIDATE_API() { // 토큰 유효성 검사
    return $.ajax({
        url : getApiURL(END_POINT.USER_VALIDATE_API),
        method : GET,
        headers: {...getToken()},
        success: (r) => {
            if (!isProduction()) console.log(r) // 개발 환경 콘솔 처리
            return r;
        },
        error:function(e){
            return IS_UNAUTHORIZED(e);
        }
    });
}