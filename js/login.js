$(document).ready(() => {
    window.localStorage.removeItem('accessToken')
    window.localStorage.removeItem('refreshToken')

})


const login = (type) => {
    if (type == 'KKO') {
        window.location.href = "http://formdang-api.com/api/sp/public/kakao/login";
    } else if (type == 'GOOGLE') {
        window.location.href = "http://formdang-api.com/api/sp/public/google/login";
    }
}