const P_PAGE = "page";
const P_STATUS = "status";
const P_TYPE = "type";
const P_ORDER = "order";
const PAGE_BAR_NUM = 5;
const ts = 'type-sel'
const ss = 'status-sel'
const as = 'align-sel'
const ri = '../image/icon/gallery-remove.svg'
let page = 0, type = 99, status = 99, order = 0, totalPage = 0; // 페이지, 타입, 상태 파라미터
let endFlag = false; // 마지막 페이지 플래그
class R1 { page; type; status; order; constructor(p, t, s, o) { this.page = p; this.type = t; this.status = s; this.order = o; } }

function generateCard(e) { // 카드 생성전 개별 값 세팅
    const h = PAGE.ADMIN_DETAIL.concat(`?fid=${e.fid}`); // 상세 페이지 이동 URL세팅
    const c = e.type == 0 ? "i-survey-line" : "i-quiz-line"; // 설문, 퀴즈에 따른 아이콘 class 설정
    const s = e.type == 0 ? "설문" : "퀴즈"; // 설문 퀴즈에 따른 소제목 세팅
    const i = imgHtml(e.logoUrl) // 로고 이미지 HTML
    const t = e.title; // 제목
    const r = e.regDt; // 등록일
    const ef = e.endFlag == 1 ? 'disalbed-item' : ''; // 삭제 여부 ( 0: 미삭제, 1: 삭제)
    return cardHtml(h, c, s, i, t, r, ef);
}

function cardHtml (h, c, s, i, t, r, ef) { // 설문 카드 HTML
    let html = '';
    html =
        html.concat(`<li class="${ef}">`)
                .concat(`<a href="${h}">`)
                .concat(`<i class="ico ${c}">`)
                .concat(`<span class="skip">${s}</span></i>`)
                .concat(`<figure class="thumb">${i}</figure>`)
                .concat(`<h3>${t}</h3>`)
                .concat(`<p><i class="ico"></i>${r}</p>`)
                .concat(`</a>`)
            .concat(`</li>`)
    return html;
}

function imgHtml (i) { // 로고 이미지 HTML
    let html = '';
    if (i) html = html.concat(`<span><img src="${i}" alt=""></span>`) // 로고 이미지가 있는경우
    else html = html.concat(`<span class="not-img"><img src="${ri}" alt=""></span>`) // 로고 이미지가 없는 경우
    return html;
}

function emptyHtml() { // 등록 폼이 없는경우 빈 html 처리
    let html = ''
    html =
        html.concat(`<div class="not-result">`)
                .concat(`<i class="ico"></i>`)
                .concat(`<p>앗 ! 등록된 폼이 없어요.<br>버튼을 클릭하여 폼을 만들어주세요.</p>`)
                .concat(`<a href="write.html" class="st-ico"><i class="ico i-form"></i> <span>폼 작성하기</span></a>`)
            .concat(`</div>`)
    return html;
}


function ff (e) { // 설문 리스트 조회 함수
    fla(e).then(r => {
        if (r && r.resultCode == '0') { // 리스트 조회 성공시
            appendCards(r);
            appendAnalyze(r.analyze);
            appendPage(r.curPage, r.totalPage);
            totalPage = r.totalPage
        }
    })
}

function emptyList(data) { // 리스트가 없는 경우
    return !data || !data.list || data.list.length == 0
}

function isLastPage(data) { // 전체페이지 개수 == 현재페이지 + 1 같은 경우
    return data.totalPage == data.curPage + 1;
}

function watchingEndStatus(data) { // 마지막 페이지 감지
    if (emptyList(data) || isLastPage(data)) endFlag = true; // 마지막 페이지 처리
}

function appendEmptyHtml() { // 빈값 html append 처리
    $(".list-wrap ul").empty(); // ul 하위 HTML 정리
    let notResultElement = document.querySelector('.not-result'); // empty html 조회
    if (!notResultElement) { // 해당 html 있는지 존재하지 않는경우 추가
        $(".list-wrap").append(emptyHtml())
    }
}

function removeEmptyHtml() { // 빈값 html remove 처리
    let listWrapElement = document.querySelector('.list-wrap');
    let notResultElement = listWrapElement.querySelector('.not-result');
    if (notResultElement) { // 있는 경우 제거
        listWrapElement.removeChild(notResultElement);
    }
}

function appendCards(data) { // 폼 카드 리스트 처리
    watchingEndStatus(data); // 마지막 페이지 감지
    if (emptyList(data)) { // 리스트가 없는경우
        appendEmptyHtml(); // empty html append 처리
        return
    }
    removeEmptyHtml(); // empty html remove 처리
    data.list.forEach(e => $("#list-wrap-card").append(generateCard(e))); // 폼 카드 리스트 append
}

function appendAnalyze(data) { // 종합 분석 처리
    $("li:nth-child(1) em").text(data.quizCnt + "건"); // 퀴즈 건수
    $("li:nth-child(2) em").text(data.quizRespondentCnt + "건"); // 퀴즈 응답 건수
}

function appendPage(curPage, totalPage) { // 페이징 바 붙이기
    let bar = parseInt(curPage / PAGE_BAR_NUM) // 페이지 바 번호
    let html = '';
    //ToDo 첫페이지 비활성화 처리
    html = html.concat(`<a class="prev" onclick="movePrev()"><span class="skip">처음</span> <i class="ico"></i></a>`) // 왼쪽 화살표
    for (let i=0; i <5 ; i++) { // 페이지 붙이기
        let num = (bar * PAGE_BAR_NUM) + i + 1;
        if (num == curPage + 1) {
            html = html.concat(`<a class="current"><strong>${num}</strong></a>`) // 현재 페이지
        } else if (num <= totalPage) {
            html = html.concat(`<a onclick="movePage(this)">${num}</a>`) // 페이지
        }
    }
    // ToDo 마지막페이지 비활성화 처리
    html = html.concat(`<a class="next" onclick="moveNext()"><span class="skip">끝</span> <i class="ico"></i></a>`) // 오른쪽 화살표
    $('.inner').append(html)
}

function movePrev() { // 왼쪽 화살표 이동
    if (!isFirstPageBar(page, PAGE_BAR_NUM)) { // 처음 페이지 바 검사
        let bar = parseInt(page / PAGE_BAR_NUM) * PAGE_BAR_NUM - 1
        window.location.href = `${PAGE.ADMIN_MAIN}?${P_PAGE}=${bar}&${P_TYPE}=${type}&${P_STATUS}=${status}`
    }
}

function moveNext() { // 오른쪽 화살표 이동
    if (!isEndPageBar(page, totalPage, PAGE_BAR_NUM)) { // 마지막 페이지바 검사
        let bar = parseInt(page / PAGE_BAR_NUM) * PAGE_BAR_NUM + PAGE_BAR_NUM
        window.location.href = `${PAGE.ADMIN_MAIN}?${P_PAGE}=${bar}&${P_TYPE}=${type}&${P_STATUS}=${status}&${P_ORDER}=${order}`
    }
}

function movePage(e) { // 페이지 이동
    let page = parseInt($(e).text()) - 1
    window.location.href = `${PAGE.ADMIN_MAIN}?${P_PAGE}=${page}&${P_TYPE}=${type}&${P_STATUS}=${status}&${P_ORDER}=${order}`
}

function chi(ei, t) { // 타입 or 상태 변경 감지시 새롭게 리스트 요청
    if (t == 0) {
        type = document.getElementById(ei).value; // 타입 변경
    } else if (t == 1) {
        status = document.getElementById(ei).value; // 상태 변경
    } else if (t == 2) {
        order = document.getElementById(ei).value; // 정렬 변경
    }
    window.location.href = `${PAGE.ADMIN_MAIN}?${P_PAGE}=0&${P_TYPE}=${type}&${P_STATUS}=${status}&${P_ORDER}=${order}`
}

async function queryStringTokenParse (p) { // 로그인 후 받은 인증 토큰 세팅
    for (const e of p) {
        if (e[0] == ACCESS_TOKEN) window.localStorage.setItem(e[0], e[1]) // 로그인 JWT 토큰
        else if (e[0] == REFRESH_TOKEN) window.localStorage.setItem(e[0], e[1]) // 로그인 리프레쉬 토큰
        else if (e[0] == P_PAGE) page = e[1]; // 페이지 파라미터
        else if (e[0] == P_STATUS) status = e[1]; // 상태 파라미터
        else if (e[0] == P_TYPE) type = e[1]; // 타입 파라미터
        else if (e[0] == P_ORDER) order = e[1]; // 최신순
    }
}

$(document).ready(() => {
    queryStringTokenParse(new URLSearchParams(location.search)) // 로그인 인증 토큰 파싱 처리
        .then(() => {
            essentialLogin() // 로그인 필수 체크
        });
    document.getElementById(ts).value = type;
    document.getElementById(ss).value = status;
    document.getElementById(as).value = order;
    $('.layer-sel').niceSelect(); // 퍼블 추가 내역
})

$(window).load(() => {
    ff(new R1(page, type, status, order)); // 처음 리스트 API 호출
    $(`#${ts}`).change(function() { chi(ts, 0) }) // 타입 변경
    $(`#${ss}`).change(function() { chi(ss, 1) }) // 상태 변경
    $(`#${as}`).change(function() { chi(as, 2) }) // 상태 변경
})