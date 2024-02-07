function fd (id) { // 설문 리스트 조회 함수
    fda(id).then(r => {
        if (r && r.resultCode == '0') {
            setFormData(r)
        } else {
            open_popup("폼 조회 실패", "폼 내용을 불러오는데 실패하였습니다.", "flex", '닫기', false) // 팝업 오픈
        }
    })
}

function setFormData(data) { // 데이터 세팅
    this.setFormType(data.type); // 폼타입 설정
    this.setMaxRespondent(data.maxRespondent); // 답변 인원 설정
    this.setDate(data.beginDt, data.endDt); // 날짜 설정
    this.setHeader(data.title, data.detail); // 헤더 설정
    this.setTheme(data?.themeUrl || ''); // 테마 설정
    this.setLogo(data?.logoUrl || ri); // 로고 설정
    this.setQuestion(data.question); // 질문 리스트 붙이기
}

function setFormType(type) { // 폼 타입 설정
    const types = document.getElementsByName('formType');
    for (let i=0; i < types.length; i++) {
        if (types[i].value == type) types[i].checked = true
        else types[i].checked = false
    }
}

function setTheme(themeUrl) { // 테마 설정
    const types = document.getElementsByName('themeType');
    for (let i=0; i < types.length; i++) {
        if (types[i].value == themeUrl) types[i].checked = true
        else types[i].checked = false
    }
}

function setMaxRespondent(cnt) {  // 답변 인원 설정
    let elements = document.getElementById("num-answer-sel");
    for (let i = 0; i < elements.options.length; i++) {
        if (elements.options[i].value == cnt) {
            elements.options[i].selected = true; // select box 초기값 설정
            $('.current').text(elements.options[i].innerText) // select box 초기가 text 내용 설정
        } else {
            elements.options[i].selected = false;
        }
    }
}

function setDate(beginDt, endDt) { // 날짜 설정
    document.getElementById("startDate").value = beginDt
    document.getElementById("endDate").value = endDt
}

function setHeader(title, detail) { // 헤더 설정
    document.getElementById("subject").value = title
    document.getElementById("explain").value = detail
}

function setLogo(logo) { // 로고 설정
    if (!logo) {
        document.getElementById('not_logo').checked = true;
        document.getElementById("img-default-logo").src = logo
    } if (logo == ri) { // 로고 없음
        document.getElementById('not_logo').checked = true;
        document.getElementById("img-default-logo").src = logo
    } else if (logo == DEFAULT_LOGO_URL) { // 기본 로고
        document.getElementById('my_logo').checked = true;
        document.getElementById("img-default-logo").src = logo
    } else { // 로고 등록
        document.getElementById('file_logo').checked = true;
        document.getElementById("img-default-logo").src = logo
        set_logo_url_to_img(logo)
    }
}

function setQuestionImg(question, src) { // 질문 이미지 세팅
    if (!src) return
    const canvas = question.querySelector('canvas');
    const div = question.querySelector('.frm-upload div')
    setImg(canvas, div, src);
}

function setQuestion(q) { // 질문 등록
    const questions = q.sort((a, b) => a.order - b.order);
    questions.forEach(e => {
        if (e.type == 0) append_question(short_html())
        else if (e.type == 1) append_question(subject_html())
        else if (e.type == 2) append_question(multiple_html())
        else if (e.type == 3) append_question(look_html())
    })
    let forms = document.querySelectorAll('.inner#first_content .form-div');
    for (let i=0; i < forms.length; i++) {
        if (questions[i].type == 0) setShort(forms[i], questions[i])
        else if (questions[i].type == 1) setSubject(forms[i], questions[i])
        else if (questions[i].type == 2) setMultiple(forms[i], questions[i])
        else if (questions[i].type == 3) setLook(forms[i], questions[i])
    }
}

function setShort(question, data) { // 단답형 추가
    question.querySelector('.sub_subject').value = data.title
    question.querySelector('.sub_explain').value = data?.placeholder || ''
    for (let i = 0 ; i < data.answer.length - 1; i++) {
        question.querySelector('.bt-add').click(); // 질문 답 추가
    }
    let answers = question.querySelectorAll('.add_item');
    for (let i=0; i < answers.length; i++) {
        answers[i].querySelector('input[name="answer"]').value = data.answer[i];
    }
    this.setQuestionImg(question, data.imageUrl)
}

function setSubject(question, data) { // 서술형 추가
    question.querySelector('.sub_subject').value = data.title
    this.setQuestionImg(question, data.imageUrl)
}

function setMultiple(question, data) { // 객관식 추가
    question.querySelector('.sub_subject').value = data.title
    setCheckBox(question, data)
    this.setQuestionImg(question, data.imageUrl)
}

function setLook(question, data) { // 보기 문항 추가
    question.querySelector('.sub_subject').value = data.title
    setCheckBox(question, data)
    for (let i=1; i <=5; i++) { // 보기 처리
        const id = 'e' + i;
        const text = question.querySelector(`input[name="${id}"]`); // 체크박스 답
        text.value = data.exampleDetail[i-1];
    }
    this.setQuestionImg(question, data.imageUrl)
}

function setCheckBox(question, data) { // 공통 객관식 처리
    const checkbox = question.querySelectorAll(`input[name="each"]`); // 체크박스 답
    for (let i=0; i < data.answer.length ; i++) {
        if (data.answer[i] == 'true') {
            checkbox[i].checked = true
        }
    }
    for (let i=1; i <= 5; i++) {
        const id = 'q' + i;
        const text = question.querySelector(`input[name="${id}"]`); // 체크박스 답
        text.value = data?.detail[i-1] || '';
    }
}

$(document).ready(() => { // 초기 설정
    essentialLogin(); // 로그인 여부 검사
    append_empty_html(); // 처음 빈 div 설정
    formType = $('input[name="formType"]:checked').val(); // 초기 타입 설정
    $('.layer-sel').niceSelect(); // 퍼블 추가 내역
    let top_button = document.querySelector('.bt-top');
    top_button.addEventListener('click', function(e){
        e.preventDefault();
        window.scrollTo({top: 0, behavior: 'smooth'});
    });
    const params = new URLSearchParams(window.location.search);
    fd(params.get('fid'))
})

$(window).load(() => {
    $('input[name="formType"]').change(function () { formType = $(this).val(); }); // 폼형태
    $('input[name="themeType"]').change(function() { themeUrl = $(this).val(); }); // 테마
})