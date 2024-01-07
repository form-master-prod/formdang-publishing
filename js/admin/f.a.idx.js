const ts = 'type-sel'
const ss = 'status-sel'
let page = 1, endFlag = false, type = 99, status = 99;

const formCardHtml = function (data) {
    return `
        <li>
            <a href="${PAGE.ADMIN_DETAIL + '?fid=' + data.fid}">
                <i class="ico ${data.type == 0 ? "i-survey-line" : "i-quiz-line"}">
                <span class="skip">${data.type == 0 ? "설문" : "퀴즈"}</span></i>
                <figure class="thumb">
                    ${imageHtml(data.logoUrl)}
                </figure>
                <h3>${data.title}</h3>
            <p><i class="ico"></i> ${data.regDt}</p>
            </a>
        </li>
`
}

const imageHtml = function (img) {
    if (img) {
        return `<img src="${img}" alt="">`
    } else {
        return `<span class="not-img"><img src="../image/icon/gallery-remove.svg" alt=""></span>`
    }
}

const formEmptyHtml = function () {
    return `
    <div class="not-result">
        <i class="ico"></i>
        <p>앗 ! 등록된 폼이 없어요.<br>버튼을 클릭하여 폼을 만들어주세요.</p>
        <a href="write.html" class="st-ico"><i class="ico i-form"></i> <span>폼 작성하기</span></a>
    </div>
`
}

class R1 { page; type; status; constructor(p, t, s) { this.page = p; this.type = t; this.status = s; } }

const FF = (e) => {
    FLA(e).then(r => {
        if (r && r.resultCode == '0') {
            setForms(r);
            setAnalyze(r.analyze);
        }
    })
}

const setForms = (data) => {
    isLast(data)
    if (!data || !data.list || data.list.length == 0) {
        $(".list-wrap ul").empty();

        let notResultElement = document.querySelector('.not-result');
        if (!notResultElement) {
            $(".list-wrap").append(formEmptyHtml())
        }
        return
    }

    let listWrapElement = document.querySelector('.list-wrap');
    let notResultElement = listWrapElement.querySelector('.not-result');

    if (notResultElement) {
        listWrapElement.removeChild(notResultElement);
    }

    data.list.forEach(e => {
        $("#list-wrap-card").append(formCardHtml(e))
    })
}

const isLast = (data) => {
    if (!data || !data.list || data.list.length == 0) {
        endFlag = true;
    }else if (data.totalPage == data.curPage + 1) {
        endFlag = true;
    }
}

const setAnalyze = (data) => {
    $("li:nth-child(1) em").text(data.quizCnt + "건");
    $("li:nth-child(2) em").text(data.quizRespondentCnt + "건");
}

function parse (p) {
    for (const e of p) {
        if (e[0] == ACCESS_TOKEN) window.localStorage.setItem(e[0], e[1])
        else if (e[0] == REFRESH_TOKEN) window.localStorage.setItem(e[0], e[1])
    }
}

function CHI(ei) { // 변경 인터페이스
    $(".list-wrap ul").empty();
    status = document.getElementById(ei).value;
    FF(new R1(0, type, status));
    page = 1;
    endFlag = false;
}

function debounce(func, delay) {
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

    // 스크롤이 80%에 도달하면 특정 함수 호출
    if (scrollPercentage >= 80) {
        if (!endFlag) {
            FF(new R1(page++ , type, status));
        }
    }
}

$(document).ready(() => {
    $('.layer-sel').niceSelect();
    parse(new URLSearchParams(location.search));
    ESSENTIAL_LOGIN()
})

$(window).load(() => {

    FF(new R1(0, type, status));
    $(`#${ts}`).change(function () { CHI(ts) }) // 타입 변경
    $(`#${ss}`).change(function () { CHI(ss) }) // 상태 변경

    const debounceHandleScroll = debounce(handleScroll, 100);
    window.addEventListener('scroll', debounceHandleScroll);

})