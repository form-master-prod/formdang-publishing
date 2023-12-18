document.addEventListener("DOMContentLoaded", function() {
    let token = IS_LOGIN()
    let html = ""
    if(token) {
        let _id = getUserFromToken(token)  // 닉네임으로 교체 예정
        let _name = `${_id}님`
        $("#user_name1").text(_name);
        $("#user_name2").text(`${_name}, 안녕하세요.`);
    }else {
        location.replace('../admin/login.html');
    }
    $(".admin_header").append(html)
});
