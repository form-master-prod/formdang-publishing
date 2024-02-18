/**
 * 파라미터 누락 검증
 * @param d
 * @returns {boolean}
 */
function validate(d) {
    if (!d.fid || !d.type || !d.key) {
        off_spinner(); $('.forms-write-wrap').prepend(fail_paper("<p>폼을 조회 할 수 없습니다.</p>"));
        return false
    }
    return true;
}

/**
 * 유저 데이터 요청
 * @param d
 */
function start_find_paper(d) {
    if (!validate(d)) {
        off_spinner(); $('.forms-write-wrap').prepend(fail_paper("<p>폼을 조회 할 수 없습니다.</p>"));
        return
    }
    findPaper(d).then((res) => {
        let open, time
        time = 150;
        if (res && res.resultCode == '0') {
            open = () => { off_spinner(); on_screen() };
        } else if (res && res.resultCode == NOT_START_FORM) {
            open = () => { off_spinner(); $('.forms-write-wrap').prepend(fail_paper("<p>아직 설문이 시작되지않은 폼입니다.</p>")) }
        } else if (res && res.resultCode == DELETE_FORM) {
            open = () => { off_spinner(); $('.forms-write-wrap').prepend(fail_paper("<p>삭제 된 폼입니다.</p>"))}
        } else if (res && res.resultCode == END_FORM) {
            open = () => { off_spinner(); $('.forms-write-wrap').prepend(fail_paper("<p>종료 된 폼입니다.</p>"))}
        } else if (res && res.resultCode == NOT_LOGIN_GROUP_FORM) {
            open = () => { off_spinner(); $('.forms-write-wrap').prepend(fail_paper_login("<p>로그인이 필요한 폼입니다.</p>"))}
        } else if (res && res.resultCode == IS_NOT_GROUP_FORM_USER) {
            open = () => { off_spinner(); $('.forms-write-wrap').prepend(fail_paper("<p>해당 폼 그룹원이 아닙니다.</p>"))}
        } else if (res && res.resultCode == IS_MAX_RESPONSE) {
            open = () => { off_spinner(); $('.forms-write-wrap').prepend(fail_paper("<p>이용자가 초과된 폼입니다.</p>"))}
        } else if (res && res.resultCode == IS_NOT_RIGHT_DATE) {
            open = () => { off_spinner(); $('.forms-write-wrap').prepend(fail_paper("<p>폼 이용 가능한 날짜가 아닙니다.</p>"))}
        } else {
            open = () => { off_spinner(); $('.forms-write-wrap').prepend(fail_paper("<p>폼을 조회 할 수 없습니다.</p>"))}
        }
        setTimeout(open, time)
    });
}

/**
 * 유저 폼 데이터 요청 처리
 * @param d
 */
async function findPaper(d) {
    return find_paper_api(d).then(res => {
        if (res && res.resultCode == '0') {
            set_data(res)
        }
        return res;
    })
    .catch(e => {
        return null
    })
}

/**
 * 데이터 처리
 * @param d
 */
function set_data(d) {
    const el = document.getElementsByClassName('frm-area subject')[0]
    el.querySelector('h3').innerText = d.title
    el.querySelector('p').innerText = d.detail
    if (d.logoUrl) el.querySelector('.img-view img').src = d.logoUrl
    else el.querySelector('.img-view img').src = '../image/icon/gallery-remove.svg'
    document.getElementsByClassName('sub-tit')[0].innerHTML = `${d.type == 0 ? 'Survey' : 'Quiz'}`
    set_question(d.question.sort((a, b) => a.order - b.order))
}

/**
 * 질문 리스트 append
 * @param q
 */
function set_question(q) {
    q.forEach(e => {
        if (e.type == 0) user_append_question(user_short_html(e))
        else if (e.type == 1) user_append_question(user_subject_html(e))
        else if (e.type == 2) user_append_question(user_multiple_html(e))
        else if (e.type == 3) user_append_question(user_look_html(e))
    })
}

/**
 * 모달 확인 처리
 */
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

function on_screen() {
    document.getElementsByClassName('wr-wrap')[0].style.display = 'block'
    document.getElementsByClassName('bt-wrap')[0].style.display = 'flex'
}

function off_screen() {
    document.getElementsByClassName('wr-wrap')[0].style.display = 'none'
    document.getElementsByClassName('bt-wrap')[0].style.display = 'none'
}

/**
 * 퍼블 작업 내역
 */
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

$(document).ready(() => { // 초기 설정
    off_screen()
    on_spinner()
    const params = new URLSearchParams(window.location.search);
    let modalElement = document.getElementById('modal_layer')
    if (!modalElement)  $("#viewform-wrap").after(modal_html()); // 모달 붙이기
    start_find_paper(new Paper(params.get("fid"), params.get("type"), params.get("key")))
})

$(window).load(() => {
    purple_script();
})