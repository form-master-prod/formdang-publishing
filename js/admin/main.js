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
        <a href="#" class="st-ico"><i class="ico i-form"></i> <span>폼 작성하기</span></a>
    </div>
`
}

const findForms = async (page, type) => {
    return await FORM_LIST_API({
        page: page,
        type: type
    }).then(res => {
        if (res && res.resultCode == '0') {
            return res;
        } else {
            return null;
        }
    })
}

const findAnalyze = async () => {
    return await FIND_ANALYZE_API()
        .then(res => {
            if (res && res.resultCode == '0') {
                return res;
            } else {
                return null;
            }
        })
}

const setForms = async (data) => {
    isLast(data)
    if (!data || !data.list || data.list.length == 0) {
        $("#list-wrap-card").append(formEmptyHtml())
        return
    }
    data.list.forEach(e => {
        $("#list-wrap-card").append(formCardHtml(e))
    })
}

const isLast = (data) => {
    if (data.totalPage == data.curPage + 1) {
        endFlag = true;
    }
}

const setAnalyze = async (data) => {
    $("li:nth-child(1) em").text(data.inspectionCnt + "건");
    $("li:nth-child(2) em").text(data.quizCnt + "건");
    $("li:nth-child(3) em").text(data.inspectionRespondentCnt + "명");
    $("li:nth-child(4) em").text(data.quizRespondentCnt + "명");
}

$(document).ready(() => {
    $('.layer-sel').niceSelect();

    const searchParams = new URLSearchParams(location.search);

    for (const param of searchParams) {
        let key = param[0];
        let value = param[1];
        if (key == ACCESS_TOKEN) window.localStorage.setItem(key, value)
        else if (key == REFRESH_TOKEN) window.localStorage.setItem(key, value)
    }

    ESSENTIAL_LOGIN()
    USER_VALIDATE_API()

})

let page = 1, endFlag = false;

$(window).load(() => {


    findForms(0, document.getElementById('type-sel').value).then(res => setForms(res));
    findAnalyze().then(res => setAnalyze(res));

    $('#type-sel').change(function () {
        $(".list-wrap ul").empty();
        findForms(0, document.getElementById('type-sel').value).then(res => setForms(res));
        page = 1;
        endFlag = false;
    })


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
                findForms(page++ , document.getElementById('type-sel').value).then(res => setForms(res));
            }
        }
    }

    const debounceHandleScroll = debounce(handleScroll, 100);

    window.addEventListener('scroll', debounceHandleScroll);

})