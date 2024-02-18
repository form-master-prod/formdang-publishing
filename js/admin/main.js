const P_PAGE = "page";
const P_STATUS = "status";
const P_TYPE = "type";
const P_ORDER = "order";
const PAGE_BAR_NUM = 5;
const ts = 'type-sel'
const ss = 'status-sel'
const as = 'align-sel'
let page = 0, type = 99, status = 99, order = 0, totalPage = 0; // 페이지, 타입, 상태 파라미터
let endFlag = false; // 마지막 페이지 플래그

/**
 * 카드 개별 html append
 * @param e
 * @returns {string}
 */
function generate_card(e) { // 카드 생성전 개별 값 세팅
    const url = PAGE.ADMIN_DETAIL.concat(`?fid=${e.fid}`); // 상세 페이지 이동 URL세팅
    const ico = e.type == 0 ? "i-survey-line" : "i-quiz-line"; // 설문, 퀴즈에 따른 아이콘 class 설정
    const sub = e.type == 0 ? "설문" : "퀴즈"; // 설문 퀴즈에 따른 소제목 세팅
    const logo = main_img_html(e.logoUrl) // 로고 이미지 HTML
    const title = e.title; // 제목
    const regDt = e.regDt; // 등록일
    const del = e.delFlag == 1 ? 'disalbed-item' : ''; // 삭제 여부 ( 0: 미삭제, 1: 삭제)
    return card_html(url, ico, sub, logo, title, regDt, del);
}

/**
 * 설문 리스트 조회
 * @param e
 */
function find_form_list (e) { // 설문 리스트 조회 함수
    find_form_list_api(e).then(res => {
        if (res && res.resultCode == '0') { // 리스트 조회 성공시
            append_cards(res);
            append_analyze(res.analyze);
            append_page_bar(res.curPage, res.totalPage);
            totalPage = res.totalPage
        }
        setTimeout(() => {
            off_spinner()
            on_screen()
        }, 150)
    })
}

/**
 * 리스트 빈값 검사
 * @param data
 * @returns {boolean}
 */
function validate_empty_list(data) { // 리스트가 없는 경우
    return !data || !data.list || data.list.length == 0
}

/**
 * 마지막 페이지 공식
 * @param data
 * @returns {boolean}
 */
function is_last_page(data) { // 전체페이지 개수 == 현재페이지 + 1 같은 경우
    return data.totalPage == data.curPage + 1;
}

/**
 * 마지막 페이지 검사
 * @param data
 */
function watching_end_page(data) { // 마지막 페이지 감지
    if (validate_empty_list(data) || is_last_page(data)) endFlag = true; // 마지막 페이지 처리
}

/**
 * 폼 카드 리스트 append
 * @param data
 */
function append_cards(data) { // 폼 카드 리스트 처리
    watching_end_page(data); // 마지막 페이지 감지
    if (validate_empty_list(data)) { // 리스트가 없는경우
        append_empty_html(); // empty html append 처리
        return
    }
    remove_empty_html(); // empty html remove 처리
    data.list.forEach(e => $("#list-wrap-card").append(generate_card(e))); // 폼 카드 리스트 append
}

/**
 * 빈 리스트 html remove
 */
function remove_empty_html() { // 빈값 html remove 처리
    let listWrapElement = document.querySelector('.list-wrap');
    let notResultElement = listWrapElement.querySelector('.not-result');
    if (notResultElement) { // 있는 경우 제거
        listWrapElement.removeChild(notResultElement);
    }
}

/**
 * 빈 리스트 html append
 */
function append_empty_html() { // 빈값 html append 처리
    $(".list-wrap ul").empty(); // ul 하위 HTML 정리
    let notResultElement = document.querySelector('.not-result'); // empty html 조회
    if (!notResultElement) { // 해당 html 있는지 존재하지 않는경우 추가
        $(".list-wrap").append(main_empty_html())
    }
}

/**
 * 종합분석 정보 append
 * @param data
 */
function append_analyze(data) { // 종합 분석 처리
    $("li:nth-child(1) em").text(data.quizCnt + "건"); // 퀴즈 건수
    $("li:nth-child(2) em").text(data.quizRespondentCnt + "건"); // 퀴즈 응답 건수
    $("li:nth-child(3) em").text(data.inspectionCnt + "건"); // 설문 건수
    $("li:nth-child(4) em").text(data.inspectionRespondentCnt + "건"); // 설문 응답 건수
}

/**
 * 상태 변경 리스트 재조회
 * @param ei
 * @param t
 */
function change_forms(ei, t) { // 타입 or 상태 변경 감지시 새롭게 리스트 요청
    if (t == 0) {
        type = document.getElementById(ei).value; // 타입 변경
    } else if (t == 1) {
        status = document.getElementById(ei).value; // 상태 변경
    } else if (t == 2) {
        order = document.getElementById(ei).value; // 정렬 변경
    }
    window.location.href = `${PAGE.ADMIN_MAIN}?${P_PAGE}=0&${P_TYPE}=${type}&${P_STATUS}=${status}&${P_ORDER}=${order}`
}

/**
 * 파라미터 파싱
 * @param p
 * @returns {Promise<void>}
 */
async function query_parse (p) { // 로그인 후 받은 인증 토큰 세팅
    for (const e of p) {
        if (e[0] == ACCESS_TOKEN) window.localStorage.setItem(e[0], e[1]) // 로그인 JWT 토큰
        else if (e[0] == REFRESH_TOKEN) window.localStorage.setItem(e[0], e[1]) // 로그인 리프레쉬 토큰
        else if (e[0] == P_PAGE) page = e[1]; // 페이지 파라미터
        else if (e[0] == P_STATUS) status = e[1]; // 상태 파라미터
        else if (e[0] == P_TYPE) type = e[1]; // 타입 파라미터
        else if (e[0] == P_ORDER) order = e[1]; // 최신순
    }
}

/**
 * 쿼리스트링 제거 (토큰정보)
 */
function disable_querystring() {
    let currentUrl = window.location.href;
    let queryStringIndex = currentUrl.indexOf('?');

    if (queryStringIndex !== -1) {
        let queryString = currentUrl.substring(queryStringIndex + 1);
        let paramsArray = queryString.split('&');
        let updatedParams = [];
        for (let i = 0; i < paramsArray.length; i++) {
            let param = paramsArray[i];
            let paramName = param.split('=')[0];
            if (paramName !== ACCESS_TOKEN && paramName !== REFRESH_TOKEN) {
                updatedParams.push(param);
            }
        }
        let updatedUrl = currentUrl.substring(0, queryStringIndex) + '?' + updatedParams.join('&');
        history.replaceState({}, document.title, updatedUrl);
    }
}

/**
 * 메인 화면 오픈
 */
function on_screen() {
    document.getElementsByClassName('list-wrap')[0].style.display = 'block'
    document.getElementsByClassName('pagenate')[0].style.display = 'flex'
}

/**
 * 메인 화면 disable
 */
function off_screen() {
    document.getElementsByClassName('list-wrap')[0].style.display = 'none'
    document.getElementsByClassName('pagenate')[0].style.display = 'none'
}

/**
 * 모달 확인 클릭 처리
 */
function ok_popup() {
    if (modal_type == 'C') { // 모달 닫기 버튼
        close_popup();
    } else if (modal_type == 'M') {
        forwarding(PAGE.LOGIN.MY);
    }
}

/**
 * 모달 닫기 처리
 */
function close_popup() { // 팝업 닫기
    document.getElementById('modal_layer').style.display = "none";
    document.body.style.overflow = "auto";
}

$(document).ready(() => {
    query_parse(new URLSearchParams(window.location.search)).then(() => {
            essentialLogin() // 로그인 필수 체크
            disable_querystring();
    });
    document.getElementById(ts).value = type;
    document.getElementById(ss).value = status;
    document.getElementById(as).value = order;
    $(`#${ts}`).change(function() { change_forms(ts, 0) }) // 타입 변경
    $(`#${ss}`).change(function() { change_forms(ss, 1) }) // 상태 변경
    $(`#${as}`).change(function() { change_forms(as, 2) }) // 상태 변경
    $('.layer-sel').niceSelect(); // 퍼블 추가 내역
})

$(window).load(() => {
    off_screen();
    on_spinner();
    find_form_list(new List(page, type, status, order)); // 처음 리스트 API 호출
})