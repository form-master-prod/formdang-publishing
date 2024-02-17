/**
 * 공통 상수 js
 */

// URL 상수
const PROD_DOMAIN_NAME = 'formdang.com'; // 운영 도메인명
const PROD_WEB_URL = "https://formdang.com"; // 운영 WEB 서버 URL
const DEV_WEB_URL = "http://localhost:63342"; // 개발 WEB 서버 URL
const PROD_API_URL = "https://formdang-api.com"; // 운영 API 서버 URL
const DEV_API_URL = "http://localhost:12001"; // 개발 API 서버 URL
const DEV_PREFIX_URI = "/formdang-publishing"; // 개발 WEB 서버 prefix uri
const PROD = "prod"; // 운영 상수
const DEV = "dev"; // 개발 상수

// 토큰 상수
const ACCESS_TOKEN = "accessToken"; // 토큰명 상수
const REFRESH_TOKEN = "refreshToken"; // 리프뤠시 토큰명 상수

// 공통 상수
const KKO = "KKO"; // 카카오 로그인 타입 상수
const GOOGLE = "GOOGLE"; // 구글 로그인 타입 상수

const WEB_SERVER_URL = getURL(PROD_WEB_URL, DEV_WEB_URL); // 환경에 따른 WEB 서버 URL
const API_SERVER_URL = getURL(PROD_API_URL, DEV_API_URL); // 환경에 따른 API 서버 URL
const PAGE  = { // 환경에 따른 페이지 URL
    MAIN: getWebURL(""),
    ADMIN_MAIN: getWebURL("/admin/index.html"),
    ADMIN_DETAIL: getWebURL("/admin/my_forms.html"),
    LOGIN: {
        MY: getWebURL("/admin/login.html"),
        KKO: getApiURL("/api/sp/public/kakao/login"),
        GOOGLE: getApiURL("/api/sp/public/google/login"),
    },
}

function isProduction() { return window.location.host == PROD_DOMAIN_NAME; }; // 운영 여부 함수
function getURL(p, d) { return isProduction() ? p : d; }; // 환경에 따른 URL 생성 함수
function getWebURL(u) { return WEB_SERVER_URL + getURL(u, DEV_PREFIX_URI + u); }; // 환경에 따른 WEB URL 생성 함수
function getApiURL(u) { return API_SERVER_URL + u; }; // 환경에 따른 API URL 생성 함수
function getActiveLevel(p, d) { return isProduction() ? p : d; }; // 환경에 따른 액티브 환경 레벨 생성 함수
function forwarding(u) { return window.location.replace(u); }; // 페이지 포워딩 함수

function login(t) { // 로그인
    if (t == KKO) forwarding(PAGE.LOGIN.KKO);
    else if (t == GOOGLE) forwarding(PAGE.LOGIN.GOOGLE);
}

function removeLoginInfo() { // 로그인 토큰 삭제
    window.localStorage.removeItem(ACCESS_TOKEN);
    window.localStorage.removeItem(REFRESH_TOKEN);
}

function logout() { // 로그아웃 공통 로직
    removeLoginInfo();
    forwarding(PAGE.MAIN);
}

function logoutAuto() { // 토큰 삭제 및 토큰 유효성 만료 자동 로그아웃
    removeLoginInfo();
    open_popup('로그 아웃', '유효 시간이 만료되어 로그아웃 됩니다. 다시 로그인을 해주세요.', 'flex', '닫기', false, 'M') // 팝업 오픈
}

function isLogin() { // 로그인 체크 공통 로직
    return window.localStorage.getItem(ACCESS_TOKEN);
}

function essentialLogin() { // 로그인 필수 체크
    if (isLogin) { // 토큰 존재
        uva(); // 토큰 유효성 검사
    } else { // 토큰 미존재
        logoutAuto()
    }
}

function isUnAuthorized(e) { // 401 토큰 유효성 실패 상태
    if (e && e.status == 401) logoutAuto() // 토큰 유효성 오류
    else return null;
}