function navigation(u) {
    if (isLogin()) window.location.href = u;
    else window.location.href = PAGE.LOGIN.MY;
}

function userHtml() {
    let html = ''
    html =
        html.concat(`<div class="user_logout">`)
            .concat(`<figure><img src="../image/common/not_profile.svg" alt="profile"></figure>`)
            .concat(`<a href="javascript:void(0);" onclick="logout()">Logout <i class="ico"></i></a>`)
        .concat(`</div>`)
    return html
}

$(document).ready(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        uva2().then(r => {
            if (r && r.resultCode == '0') {
                $(".user_login").remove();  // 로그인 화면 삭제
                $("#header").append(userHtml());
            }
        })
    }
})

$(window).load(() => {
    let top_button = document.querySelector('.bt-top');
    top_button.addEventListener('click', function(e){
        e.preventDefault();
        window.scrollTo({top: 0, behavior: 'smooth'});
    });
})
