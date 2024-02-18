function navigation(u) {
    if (isLogin()) window.location.href = u;
    else window.location.href = PAGE.LOGIN.MY;
}

function userLogoutHtml() {
    let html = ''
    html =
        html.concat(`<div class="user_login">`)
            .concat(`<figure><img src="./image/common/not_profile.svg" alt="profile"></figure>`)
            .concat(`<a href="./admin/login.html">Login <i class="ico"></i></a>`)
            .concat(`</div>`)
    return html;
}

function userLoginHtml() {
    let html = ''
    html =
        html.concat(`<div class="user_logout">`)
            .concat(`<figure><img src="../image/common/not_profile.svg" alt="profile"></figure>`)
            .concat(`<a href="javascript:void(0);" onclick="logout()">Logout <i class="ico"></i></a>`)
        .concat(`</div>`)
    return html
}

function appendUserLoginHtml() {
    $(".user_login").remove();  // 로그인 화면 삭제
    $("#header").append(userLoginHtml());
}

function appendUserLogoutHtml() {
    $(".user_logout").remove();
    $("#header").append(userLogoutHtml());
}

function loginIco() {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
        validate_token_api2().then(r => {
            if (r && r.resultCode == '0') {
                appendUserLoginHtml()
            } else {
                appendUserLogoutHtml()
            }
        }).catch(e => { appendUserLogoutHtml() })
    } else {
        appendUserLogoutHtml();
    }
}

$(document).ready(() => {
    loginIco(); // 로그인 아이콘 처리
})

$(window).load(() => {
    let top_button = document.querySelector('.bt-top');
    top_button.addEventListener('click', function(e){
        e.preventDefault();
        window.scrollTo({top: 0, behavior: 'smooth'});
    });
})
