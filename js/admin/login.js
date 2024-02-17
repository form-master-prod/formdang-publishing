function ok_popup() {
    if (modal_type == 'C') { // 모달 닫기 버튼
        close_popup();
    }
}

/**
 * 모달 닫기 처리
 */
function close_popup() { // 팝업 닫기
    document.getElementById('modal_layer').style.display = "none";
    document.body.style.overflow = "auto";
}

$(window).load(() => {
    const param = new URLSearchParams(window.location.search)

    if (param.get("fail") == 'true') {
        open_popup("로그인 오류", "로그인 오류가 발생하였습니다.", "flex", '닫기', false, 'C') // 팝업 오픈
    }
})