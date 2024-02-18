
function purple_script() {
    //user modal layer
    let user = document.querySelector('.user_login');
    let modal = document.querySelector('.mem_info');
    let modal_close = document.querySelector('.bt-close');

    user.addEventListener('click', function(){
        modal.classList.add('open');
    });
    // modal_close.addEventListener('click', function(){
    //     modal.classList.remove('open');
    // }); 뱃지 제거로 주석 처리

    let top_button = document.querySelector('.bt-top');
    top_button.addEventListener('click', function(e){
        e.preventDefault();
        window.scrollTo({top: 0, behavior: 'smooth'});
    });

    let bottom_button = document.querySelector('.bt-btm');
    bottom_button.addEventListener('click', function(e){
        e.preventDefault();
        window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
    });
}


function findPaper(d) {
    find_paper_api(d).then(res => {
        if (res && res.resultCode == '0') {
            setData(res)
        } else if (res && res.resultCode == NOT_START_FORM) {
            open_popup("조회 실패", "아직 설문이 시작되지않은 폼입니다.", "flex", '닫기', false, 'C') // 팝업 오픈
        } else if (res && res.resultCode == DELETE_FORM) {
            open_popup("조회 실패", "삭제된 폼은 조회 할 수 없습니다.", "flex", '닫기', false, 'C') // 팝업 오픈
        } else if (res && res.resultCode == END_FORM) {
            open_popup("조회 실패", "이미 종료된 폼 입니다.", "flex", '닫기', false, 'C') // 팝업 오픈
        } else if (res && res.resultCode == NOT_LOGIN_GROUP_FORM) {
            open_popup("조회 실패", "로그인이 필요합니다.", "flex", '닫기', false, 'L') // 팝업 오픈
        } else if (res && res.resultCode == IS_NOT_GROUP_FORM_USER) {
            open_popup("조회 실패", "해당 폼 그룹 가입자가 아닙니다.", "flex", '닫기', false, 'C') // 팝업 오픈
        } else if (res && res.resultCode == IS_MAX_RESPONSE) {
            open_popup("조회 실패", "이용자가 초과된 폼입니다.", "flex", '닫기', false, 'C') // 팝업 오픈
        } else if (res && res.resultCode == IS_NOT_RIGHT_DATE) {
            open_popup("조회 실패", "폼 이용 가능한 날짜가 아닙니다.", "flex", '닫기', false, 'C') // 팝업 오픈
        } else {
            open_popup("조회 실패", "폼을 조회 할 수 없습니다.", "flex", '닫기', false, 'C') // 팝업 오픈
        }
    })
    .catch(e => {
        open_popup("조회 실패", "폼을 조회 할 수 없습니다.", "flex", '닫기', false, 'C') // 팝업 오픈
    })
}

function validate(d) {
    if (!d.fid || !d.type || !d.key) {
        return false
    }
    return true;
}

function start_find_paper(d) {
    if (!validate(d)) {
        open_popup("조회 실패", "폼을 조회 할 수 없습니다.", "flex", '닫기', false, 'C') // 팝업 오픈
        return
    }
    findPaper(d);
}

function setData(d) {
    const el = document.getElementsByClassName('frm-area subject')[0]
    el.querySelector('h3').innerText = d.title
    el.querySelector('p').innerText = d.detail
    if (d.logoUrl) {
        el.querySelector('.img-view img').src = d.logoUrl
    } else {
        el.querySelector('.img-view img').src = '../image/icon/gallery-remove.svg'
    }
    let header = `${d.type == 0 ? 'Survey' : 'Quiz'}`
    header = header.concat(`\t( 질문 총 개수 : ${d.questionCount}개,\t제출 인원 : ${d.answerCount}명 / ${d.maxRespondent == 0 ? '제한없음' : d.maxRespondent + '명'} )`)
    header = header.concat(`<br/><br/>기간 : ${d.beginDt} - ${d.endDt}`)
    document.getElementsByClassName('sub-tit')[0].innerHTML = header

}

function ok_popup() {
    if (modal_type == 'C') { // 모달 닫기 버튼
        close_popup();
    } else if (modal_type == 'L') {
        window.location.href = PAGE.LOGIN.MY
    }
}

/**
 * 모달 닫기 처리
 */
function close_popup() { // 팝업 닫기
    document.getElementById('modal_layer').style.display = "none";
    document.body.style.overflow = "auto";
}

$(document).ready(() => { // 초기 설정
    const params = new URLSearchParams(window.location.search);
    let modalElement = document.getElementById('modal_layer')
    if (!modalElement)  $("#viewform-wrap").after(modal_html()); // 모달 붙이기
    start_find_paper(new Paper(params.get("fid"), params.get("type"), params.get("key")))
})

$(window).load(() => {
    purple_script();
})