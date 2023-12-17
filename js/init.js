const PROD_DOMAIN = 'formdang.com';

const LEVEL = window.location.host == PROD_DOMAIN ? "prod" : "dev";

const WEB_SERVER_DOMAIN = window.location.host == PROD_DOMAIN ? "https://formdang.com" : "http://localhost:63342";
const API_SERVER_DOMAIN = window.location.host == PROD_DOMAIN ? "https://formdang-api.com" : "http://localhost:12001";

const ACCESS_TOKEN = "accessToken";
const REFRESH_TOKEN = "refreshToken";

const PROD_PAGE = { // 운영 페이지
    MAIN: WEB_SERVER_DOMAIN,
    ADMIN_MAIN: `${WEB_SERVER_DOMAIN}/formdang-publishing/admin/index.html`,
    LOGIN: {
        MY: `${WEB_SERVER_DOMAIN}/admin/login.html`,
        KKO: `${API_SERVER_DOMAIN}/api/sp/public/kakao/login`,
        GOOGLE: `${API_SERVER_DOMAIN}/api/sp/public/google/login`
    }
}

const DEV_PAGE = { // 개발 페이지
    MAIN: `${WEB_SERVER_DOMAIN}/formdang-publishing/web/index.html`,
    ADMIN_MAIN: `${WEB_SERVER_DOMAIN}/formdang-publishing/admin/index.html`,
    LOGIN: {
        MY: `${WEB_SERVER_DOMAIN}/formdang-publishing/admin/login.html`,
        KKO: `${API_SERVER_DOMAIN}/api/sp/public/kakao/login`,
        GOOGLE: `${API_SERVER_DOMAIN}/api/sp/public/google/login`
    }
}

const PAGE = LEVEL == 'prod' ? PROD_PAGE : DEV_PAGE

const LOGIN = (type) => { // 로그인
    if (type == 'KKO') window.location.replace(PAGE.LOGIN.KKO)
    else if (type == 'GOOGLE') window.location.replace(PAGE.LOGIN.GOOGLE)
}

const REMOVE_LOGIN_INFO = () => { // 로그인 토큰 삭제
    window.localStorage.removeItem(ACCESS_TOKEN)
    window.localStorage.removeItem(REFRESH_TOKEN)
}

const LOGOUT = () => { // 로그아웃 공통 로직
    REMOVE_LOGIN_INFO()
    window.location.replace(PAGE.MAIN)
}

const IS_LOGIN = () => { // 로그인 체크 공통 로직
    return window.localStorage.getItem(ACCESS_TOKEN)
}

const ESSENTIAL_LOGIN = () => {
    if (!IS_LOGIN()) {
        alert('로그인을 해주세요.')
        window.location.replace(PAGE.LOGIN.MY)
    }
}

$(document).ready(() => {

})

$(window).load(() => {

})