/**
 * 모달 js
 */

let modal_type = 'R';

/**
 * closeModal, okModal 함수는 서비스 js 파일에서 정의해서 사용
 * @returns {string}
 */
function modal_html() {
    let html = ''
    html =
        html.concat(`<div class="window_alert" id="modal_layer">`)
                .concat(`<div class="modal-layer">`)
                    .concat(`<div class="inner">`)
                        .concat(`<i class="ico" id="modal-ico"></i>`)
                        .concat(`<h2 class="skip" id="modal-title"></h2>`)
                        .concat(`<p id="modal-content"></p>`)
                    .concat(`</div>`)
                .concat(`<div class="bt-wrap">`)
                    .concat(`<button type="button" class="st-ico" id="modal-cancel" onclick="close_popup()"><span>취소</span></button>`)
                    .concat(`<button type="button" class="st-fill" id="modal-ok" onclick="ok_popup()"><span></span></button>`)
                .concat(`</div>`)
            .concat(`</div>`)
    return html;
}

/**
 * 모달 열기
 *
 *
 * @param title 타이틀
 * @param content 내용
 * @param ico 아이콘 사용 여부
 * @param ok 성공 버튼 내용
 * @param cancel 취소 버튼 사용 여부
 * @param type 모달 타입
 */
function open_popup(title, content, ico, ok, cancel, type) { // 팝업 오픈
    document.body.style.overflow = "hidden";
    document.getElementById("modal-title").innerText = title;
    document.getElementById("modal-content").innerHTML = content;
    document.getElementById("modal-ico").style.display = ico;
    document.getElementById('modal-ok').innerText = ok;
    document.getElementById('modal-cancel').style.display = cancel ? 'flex' : 'none';
    document.getElementById('modal_layer').style.display = "flex";
    modal_type = type;
}

$(document).ready(() => {
    let modalElement = document.getElementById('modal_layer')
    if (!modalElement)  $("#wrap").after(modal_html()); // 모달 붙이기
})