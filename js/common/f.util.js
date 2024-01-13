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

function formatDateToyyyyMMdd(date) {
    let inputDate = new Date(date);
    if (isNaN(inputDate.getTime())) return '';
    const year = inputDate.getFullYear();
    const month = ('0' + (inputDate.getMonth() + 1)).slice(-2); // 월은 0부터 시작하므로 1을 더하고 2자리로 포맷
    const day = ('0' + inputDate.getDate()).slice(-2); // 날짜를 2자리로 포맷
    return year + month + day;
}