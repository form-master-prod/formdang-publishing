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

const findForms = async (page, type, status) => {
    return await FORM_LIST_API({
        page: page,
        type: type,
        status: status
    }).then(res => {
        if (res && res.resultCode == '0') {
            return res;
        } else {
            return null;
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

})

let page = 1, endFlag = false, type = 99, status = 99;

$(window).load(() => {


    findForms(0, type, status).then(res => { setForms(res); setAnalyze(res.analyze); });

    $('#type-sel').change(function () {
        $(".list-wrap ul").empty();
        type = document.getElementById('type-sel').value;
        findForms(0, type, status).then(res => { setForms(res); setAnalyze(res.analyze); });
        page = 1;
        endFlag = false;
    })

    $('#status-sel').change(function () {
        $(".list-wrap ul").empty();
        status = document.getElementById('status-sel').value;
        findForms(0, type, status).then(res => { setForms(res); setAnalyze(res.analyze); });
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
                findForms(page++ , type, status).then(res => { setForms(res); setAnalyze(res.analyze); });
            }
        }
    }

    const debounceHandleScroll = debounce(handleScroll, 100);

    window.addEventListener('scroll', debounceHandleScroll);

})