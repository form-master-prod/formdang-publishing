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
    $(".list-wrap ul:first").remove();
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

const setForms = async (data) => {
    if (!data || !data.list || data.list.length == 0) {
        $(".list-wrap").append(formEmptyHtml())
        return
    }
    $(".list-wrap").append("<ul>")
    data.list.forEach(e => {
        $(".list-wrap ul").append(formCardHtml(e))
    })
    $(".list-wrap").append("</ul>")
    console.log(data)
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

    findForms(0, document.getElementById('type-sel').value).then(res => setForms(res));

})

$(window).load(() => {
    ESSENTIAL_LOGIN()


    $('#type-sel').change(function () {
        findForms(0, document.getElementById('type-sel').value).then(res => setForms(res));
    })

})