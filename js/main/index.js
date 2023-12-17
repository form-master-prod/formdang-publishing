

const navigation = (url) => {
    if (IS_LOGIN()) window.location.href = url;
    else window.location.href = PAGE.LOGIN.MY;
}

$(document).ready(() => {

})

$(window).load(() => {
    let top_button = document.querySelector('.bt-top');
    top_button.addEventListener('click', function(e){
        e.preventDefault();
        window.scrollTo({top: 0, behavior: 'smooth'});
    });
})

$(document).ready(function() {
    const token = localStorage.getItem('accessToken');
    if (token) {
        $.ajax({
            url: 'https://formdang-api.com/auth/sp/validate',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Access-Control-Allow-Origin': 'https://formdang.com',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Credentials': true
            },
            success: function(response) {
                $(".user_login").remove();
                let html = `<div class="user_logout">
                                <figure><img src="../image/common/not_profile.svg" alt="profile"></figure>
                                <a href="javascript:void(0);" onclick="LOGOUT()">Logout <i class="ico"></i></a>
                            </div>`;
                $("#header").append(html);
            },
            error: function(xhr) {
                if (xhr.status === 401) {
                    console.log('401 Authentication failed');
                    // alert("로그인을 다시 시도해주세요.");
                    // window.location.href = "../admin/login.html"
                } else {
                    console.log('500 Internal logic failed');
                    // alert("로그인을 다시 시도해주세요.");
                    // window.location.href = "../admin/login.html"
                }
            }
        });
    }
});