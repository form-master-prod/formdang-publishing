const FID = 'fid';
const TYPE= 'type';
const KEY = 'key';

async function query_parse (p) {
    for (const e of p) {
        if (e[0] === ACCESS_TOKEN) window.localStorage.setItem(e[0], e[1]) // 로그인 JWT 토큰
        else if (e[0] === REFRESH_TOKEN) window.localStorage.setItem(e[0], e[1]) // 로그인 리프레쉬 토큰
        else if (e[0] === FID) window.sessionStorage.setItem(e[0], e[1]) // 설문 아이디
        else if (e[0] === TYPE) window.sessionStorage.setItem(e[0], e[1]) // 설문 타입
        else if (e[0] === KEY) window.sessionStorage.setItem(e[0], e[1]) // 설문 키
    }
}

/**
 * 유저 데이터 요청
 * @param d
 */
function start_find_paper(d) {
    if (!d.fid || !d.type || !d.key) {
        setTimeout(noticePage('폼을 조회 할 수 없습니다.', 0), 0)
        return
    }
    find_paper_api(d).then((res) => {
        const code = res.resultCode;
        if (code === SUCCESS) {
            if (res.submit) {
                setTimeout(noticePage(`제출 완료하였습니다.<br> 나만의 폼을 작성해보세요.`, 0), 150)
            } else {
                set_data(res);
                setTimeout(onPage(0, res.worker, res.submit), 150)
            }

        } else if (code === IS_NOT_LOGIN) {
            if (res.loginFlag === 1) { // 비로그인 문항
                set_data(res);
                setTimeout(onPage(0,false, false), 150)
            } else {
                set_data(res);
                setTimeout(onPage(1,false, res.submit), 150)
            }
        } else if (code === NOT_START_FORM) {
            setTimeout(noticePage(`작성자가 아직 폼을 등록하지 않았습니다. </br> 폼 등록이 완료된 이후 이용해주세요.`, 0), 150)
        } else if (code === DELETE_FORM) {
            setTimeout(noticePage('폼이 삭제되어 이용이 불가합니다.', 0), 150)
        } else if (code === END_FORM) {
            setTimeout(noticePage('해당 폼은 종료 되었습니다. </br> 많은 이용 감사합니다.', 0), 150)
        } else if (code === IS_NOT_RIGHT_DATE) {
            setTimeout(noticePage('폼 이용기간이 아닙니다.', 0), 150)
        } else if (code === IS_NOT_GROUP_FORM_USER) {
            setTimeout(noticePage('해당 폼 그룹원이 아닙니다.', 0), 150)
        } else if (code === IS_MAX_RESPONSE) {
            setTimeout(noticePage('이용자가 초과된 폼입니다.', 0), 150)
        } else {
            setTimeout(noticePage('폼을 불러오는데 문제가 발생되었습니다.', 0), 150)
        }
    })
    .catch(e => {
        console.log(e)
        setTimeout(noticePage('폼을 불러오는데 문제가 발생되었습니다.', 0), 150)
    });
}

function noticePage(title, type) {
    return () => {
        if (!document.getElementById('not-result')) {
            $('.forms-write-wrap').prepend(fail_paper(`<p>${title}</p>`))
        }
        off_spinner();
    }
}

/**
 * 데이터 처리
 * @param res
 */
function set_data(res) {
    const el = document.getElementsByClassName('frm-area subject')[0]
    el.querySelector('h3').innerText = res.title
    el.querySelector('p').innerText = res.detail
    if (res.logoUrl) el.querySelector('.img-view img').src = res.logoUrl
    else el.querySelector('.img-view img').src = '../image/icon/gallery-remove.svg'
    document.getElementsByClassName('sub-tit')[0].innerHTML = `${res.type === 0 ? 'Survey' : 'Quiz'}`
    set_question(res.question.sort((a, b) => a.order - b.order))
}

/**
 * 질문 리스트 append
 * @param questions
 */
function set_question(questions) {
    questions.forEach(e => {
        if (e.type === 0) user_append_question(user_short_html(e))
        else if (e.type === 1) user_append_question(user_subject_html(e))
        else if (e.type === 2) user_append_question(user_multiple_html(e))
        else if (e.type === 3) user_append_question(user_look_html(e))
    })
}

/**
 * 모달 확인 처리
 */
function ok_popup() {
    if (modal_type === 'C') { // 모달 닫기 버튼
        close_popup();
    } else if (modal_type === 'L') {
        window.location.href = PAGE.LOGIN.MY
    }
}

function finishSubmit() {
    offPage()
    setTimeout(noticePage(`제출 완료하였습니다.<br> 나만의 폼을 작성해보세요.`, 0), 150)
}

/**
 * 모달 닫기 처리
 */
function close_popup() { // 팝업 닫기
    document.getElementById('modal_layer').style.display = "none";
    document.body.style.overflow = "auto";
}

function onPage(type, worker, submit) {
    return () => {
        off_spinner()
        document.getElementsByClassName('wr-wrap')[0].style.display = 'block'
        document.getElementsByClassName('bt-wrap')[0].style.display = 'flex'

        if (type === 0) {
            if (worker) {
                $("#submit").append(`<button type="button" class="st-ico" ><span>작성자 확인중</span></button>`)
            } else if (submit) {
                $("#submit").append(`<button type="button" class="st-ico" onclick="move_home()"><span>나의 폼 만들기</span></button>`)
                $("#submit").append(`<button type="button" class="st-fill" ><span>제출완료</span><i class="ico"></i></button>`)
            } else {
                $("#submit").append(`<button type="button" class="st-ico" onclick="move_home()"><span>나의 폼 만들기</span></button>`)
                $("#submit").append(`<button type="button" class="st-fill" onclick="submitPaper()"><span>제출하기</span><i class="ico"></i></button>`)
            }
        } else  if (type === 1) {
            $("#submit").append(`<button type="button" class="st-ico" onclick="move_login()"><span>로그인하고 참여하기</span></button>`)
        }

    }
}

function offPage() {
    on_spinner()
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
    offPage()
    query_parse(new URLSearchParams(window.location.search)).then(() => {
        const request = new Paper(sessionStorage.getItem(FID), sessionStorage.getItem(TYPE), sessionStorage.getItem(KEY));
        start_find_paper(request)
    });
})

$(window).load(() => {
    purple_script();
    if (!document.getElementById('modal_layer')) { // 모달 붙이기
        $("#viewform-wrap").after(modal_html());
    }
})