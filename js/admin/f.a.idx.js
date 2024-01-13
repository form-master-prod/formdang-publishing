const ts = 'type-sel'
const ss = 'status-sel'
const ri = '../image/icon/gallery-remove.svg'
let page = 0, type = 99, status = 99; // 페이지, 타입, 상태 파라미터
let endFlag = false; // 마지막 페이지 플래그
class R1 { page; type; status; constructor(p, t, s) { this.page = p; this.type = t; this.status = s; } }

function generateCard(e) { // 카드 생성전 개별 값 세팅
    const h = PAGE.ADMIN_DETAIL.concat(`?fid=${e.fid}`); // 상세 페이지 이동 URL세팅
    const c = e.type == 0 ? "i-survey-line" : "i-quiz-line"; // 설문, 퀴즈에 따른 아이콘 class 설정
    const s = e.type == 0 ? "설문" : "퀴즈"; // 설문 퀴즈에 따른 소제목 세팅
    const i = imgHtml(e.logoUrl) // 로고 이미지 HTML
    const t = e.title; // 제목
    const r = e.regDt; // 등록일
    return cardHtml(h, c, s, i, t, r);
}

function cardHtml (h, c, s, i, t, r) { // 설문 카드 HTML
    let html = '';
    html.concat(`<li>`)
        html.concat(`<a href="${h}">`)
        html.concat(`<i class="ico ${c}">`)
        html.concat(`<span class="skip">${s}</span></i>`)
        html.concat(`<figure class="thumb">${i}</figure>`)
        html.concat(`<h3>${t}</h3>`)
        html.concat(`<p><i class="ico"></i>${r}</p>`)
        html.concat(`</a>`)
    html.concat(`</li>`)
    return html;
}

function imgHtml (i) { // 로고 이미지 HTML
    let html = '';
    if (i) html.concat(`<img src="${i}" alt="">`) // 로고 이미지가 있는경우
    else html.concat(`<span class="not-img"><img src="${ri}" alt=""></span>`) // 로고 이미지가 없는 경우
    return html;
}

function emptyHtml() { // 등록 폼이 없는경우 빈 html 처리
    let html = ''
    html.concat(`<div class="not-result">`)
        html.concat(`<i class="ico"></i>`)
        html.concat(`<p>앗 ! 등록된 폼이 없어요.<br>버튼을 클릭하여 폼을 만들어주세요.</p>`)
        html.concat(`<a href="write.html" class="st-ico"><i class="ico i-form"></i> <span>폼 작성하기</span></a>`)
    html.concat(`</div>`)
    return html;
}

function ff (e) { // 설문 리스트 조회 함수
    fla(e).then(r => {
        if (r && r.resultCode == '0') { // 리스트 조회 성공시
            appendCards(r);
            appendAnalyze(r.analyze);
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

function reset () { // 페이지 및 파라미터 리셋 처리
    $(".list-wrap ul").empty(); // ul 하위 HTML 정리
    page = 0; // 페이지 0번 초기화
    endFlag = false; // 마지막 페이지 플래그 초기화
}

function chi(ei) { // 타입 or 상태 변경 감지시 새롭게 리스트 요청
    reset(); // 리셋 처리
    status = document.getElementById(ei).value; // 2024.01.13 현재 상태 처리만 존재하여 상태 값만 처리
    ff(new R1(page++, type, status)); // 리스트 새롭게 조회
}

async function queryStringTokenParse (p) { // 로그인 후 받은 인증 토큰 세팅
    for (const e of p) {
        if (e[0] == ACCESS_TOKEN) window.localStorage.setItem(e[0], e[1]) // 로그인 JWT 토큰
        else if (e[0] == REFRESH_TOKEN) window.localStorage.setItem(e[0], e[1]) // 로그인 리프레쉬 토큰
    }
}

function debounce(func, delay) { // 스크롤 100ms debounce 처리
    let timeoutId;
    return function () {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, arguments);
        }, delay);
    };
}

function handleScroll() {
    const scrollPercentage = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
    if (scrollPercentage >= 80 && !endFlag) { // 스크롤이 80%에 도달하면 특정 함수 호출 & 마지막 페이지 아닌경우
        ff(new R1(page++, type, status)); // 다음 페이지 리스트 조회
    }
}

$(document).ready(() => {
    $('.layer-sel').niceSelect(); // 퍼블 추가 내역
    queryStringTokenParse(new URLSearchParams(location.search)) // 로그인 인증 토큰 파싱 처리
        .then(() => {
            essentialLogin() // 로그인 필수 체크
        });
})

$(window).load(() => {
    ff(new R1(page++, type, status)); // 처음 리스트 API 호출
    $(`#${ts}`).change(function() { chi(ts) }) // 타입 변경
    $(`#${ss}`).change(function() { chi(ss) }) // 상태 변경
    window.addEventListener('scroll', debounce(handleScroll, 100)); // 스크롤 80% 이상시 리스트 조회 이벤트 등록
})