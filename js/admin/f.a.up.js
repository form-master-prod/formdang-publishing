function fd (id) { // 설문 리스트 조회 함수
    fda(id).then(r => {
        if (r && r.resultCode == '0') {
            setFormData(r)
        } else {
            openPopUp("폼 조회 실패", "폼 내용을 불러오는데 실패하였습니다.", "flex", '닫기', false, 'C') // 팝업 오픈
        }
    })
}

function setFormData(data) {
    this.setFormType(data.type); // 폼타입 설정
    this.setMaxRespondent(data.maxRespondent); // 답변 인원 설정
    this.setDate(data.beginDt, data.endDt); // 날짜 설정
    this.setHeader(data.title, data.detail); // 헤더 설정
    this.setTheme(data?.themeUrl || ''); // 테마 설정
    this.setLogo(data?.logoUrl || ri); // 로고 설정
    this.setQuestion(data.question); // 질문 리스트 붙이기
}

function setFormType(type) {
    const types = $('input[name="formType"]');
    for (let i=0; i < types.length; i++) {
        if (types[i].value == type) types[i].checked = true
        else types[i].checked = false
    }
}

function setMaxRespondent(cnt) {
    let selectElement = document.getElementById("num-answer-sel");
    for (let i = 0; i < selectElement.options.length; i++) {
        if (selectElement.options[i].value == cnt) {
            selectElement.options[i].selected = true; // select box 초기값 설정
            $('.current').text(selectElement.options[i].innerText) // select box 초기가 text 내용 설정
        } else {
            selectElement.options[i].selected = false;
        }
    }
}

function setDate(beginDt, endDt) {
    document.getElementById("startDate").value = beginDt
    document.getElementById("endDate").value = endDt
}

function setHeader(title, detail) {
    document.getElementById("subject").value = title
    document.getElementById("explain").value = detail
}

function setTheme(themeUrl) {
    const types = $('input[name="themeType"]');
    for (let i=0; i < types.length; i++) {
        if (types[i].value == themeUrl) types[i].checked = true
        else types[i].checked = false
    }
}

function setLogo(logo) {
    if (logo == ri) {
        document.getElementById('not_logo').checked = true;
    } else if (logo == DEFAULT_LOGO_URL) {
        document.getElementById('my_logo').checked = true;
    } else {
        document.getElementById('file_logo').checked = true;
    }
    document.getElementById("img-default-logo").src = logo
}

function setQuestion(q) {
    const questions = q.sort((a, b) => a.order - b.order);
    questions.forEach(e => {
        if (e.type == 0) appendQuestion(shortHtml())
        else if (e.type == 1) appendQuestion(subjectHtml())
        else if (e.type == 2) appendQuestion(multipleHtml())
        else if (e.type == 3) appendQuestion(lookHtml())
    })
    let forms = document.querySelectorAll('.inner#first_content .form-div');
    for (let i=0; i < forms.length; i++) {
        if (questions[i].type == 0) setShort(forms[i], questions[i])
        else if (questions[i].type == 1) setSubject(forms[i], questions[i])
        else if (questions[i].type == 2) setMultiple(forms[i], questions[i])
        else if (questions[i].type == 3) setLook(forms[i], questions[i])
    }
}

function setShort(question, data) {
    question.querySelector('.sub_subject').value = data.title
    question.querySelector('.sub_explain').value = data?.placeholder || ''
    for (let i = 0 ; i < data.answer.length - 1; i++) {
        question.querySelector('.bt-add').click();
    }
    let answers = question.querySelectorAll('.add_item');
    for (let i=0; i < answers.length; i++) {
        answers[i].querySelector('input[name="answer"]').value = data.answer[i];
    }
    if (data.imageUrl) {
        question.querySelector('.not-img img').src = data.imageUrl
    }
}

function setSubject(question, data) {
    question.querySelector('.sub_subject').value = data.title
    if (data.imageUrl) {
        question.querySelector('.not-img img').src = data.imageUrl
    }
}

function setMultiple(question, data) {
    question.querySelector('.sub_subject').value = data.title
    const checkbox = question.querySelectorAll(`input[name="each"]`); // 체크박스 답
    for (let i=0; i < data.answer.length ; i++) {
        if (data.answer[i] == 'true') {
            checkbox[i].checked = true
        }
    }
    for (let i=1; i <=5; i++) {
        const id = 'q' + i;
        const text = question.querySelector(`input[name="${id}"]`); // 체크박스 답
        text.value = data.detail[i-1];
    }

    if (data.imageUrl) {
        question.querySelector('.not-img img').src = data.imageUrl
    }
}

function setLook(question, data) {
    question.querySelector('.sub_subject').value = data.title
    const checkbox = question.querySelectorAll(`input[name="each"]`); // 체크박스 답
    for (let i=0; i < data.answer.length ; i++) {
        if (data.answer[i] == 'true') {
            checkbox[i].checked = true
        }
    }
    for (let i=1; i <=5; i++) {
        const id = 'q' + i;
        const text = question.querySelector(`input[name="${id}"]`); // 체크박스 답
        text.value = data.detail[i-1];
    }

    for (let i=1; i <=5; i++) {
        const id = 'e' + i;
        const text = question.querySelector(`input[name="${id}"]`); // 체크박스 답
        text.value = data.exampleDetail[i-1];
    }

    if (data.imageUrl) {
        question.querySelector('.not-img img').src = data.imageUrl
    }
}

$(document).ready(() => { // 초기 설정
    const params = new URLSearchParams(window.location.search);
    fd(params.get('fid'))
})

$(window).load(() => {

})