

const navigation = (url) => {
    if (isLogin()) window.location.href = url;
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
        $(".user_login").remove();  // 로그인 화면 삭제
        let html = `<div class="user_logout">
                        <figure><img src="../image/common/not_profile.svg" alt="profile"></figure>
                        <a href="javascript:void(0);" onclick="logout()">Logout <i class="ico"></i></a>
                    </div>`;
        $("#header").append(html);

        // $.ajax({
        //     url: 'https://formdang-api.com/auth/sp/validate',
        //     method: 'GET',
        //     headers: {
        //         'Authorization': `Bearer ${token}`
        //     },
        //     success: function(response) {
        //         $(".user_login").remove();  // 로그인 화면 삭제
        //         let html = `<div class="user_logout">
        //                         <figure><img src="../image/common/not_profile.svg" alt="profile"></figure>
        //                         <a href="javascript:void(0);" onclick="LOGOUT()">Logout <i class="ico"></i></a>
        //                     </div>`;
        //         $("#header").append(html);
        //     },
        //     error: function(xhr) {
        //         if (xhr.status === 401) {
        //             console.log('401 Authentication failed');
        //             // alert("로그인을 다시 시도해주세요.");
        //             // window.location.href = "../admin/login.html"
        //         } else {
        //             console.log('500 Internal logic failed');
        //             // alert("로그인을 다시 시도해주세요.");
        //             // window.location.href = "../admin/login.html"
        //         }
        //     }
        // });
        //

    }
});
