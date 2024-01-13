document.addEventListener("DOMContentLoaded", function() {
    let token = isLogin()
    let html = ""
    if(token) {
        let payload = getUserFromToken(token)  // 닉네임으로 교체 예정
        let name = `${payload.name}님`
        $("#user_name1").text(name);
        $("#user_name2").text(`${name}, 안녕하세요.`);
    }else {
        location.replace('../admin/login.html');
    }
    $(".admin_header").append(html)
});
