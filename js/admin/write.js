const subjectivityHTML = `
    <div class="frm-area short-answer form-div">
        <div class="inp-group">
            <i class="number"></i>
            <label class="skip">질문 제목</label><input type="text" name="" class="sub_subject" placeholder="질문 제목을 입력해주세요.">
            <label class="skip">질문 내용</label><input type="text" name="" class="sub_explain" placeholder="주관식 질문 창에 보일 문구를 입력해주세요.">
        </div>
        <div class="frm-upload">
            <!-- 이미지 등록 -->
            <canvas id="img-view"></canvas>
            <!-- //이미지 등록 -->
            <label for="file">이미지 등록하기</label> <input type="file" name="">
        </div>
        <div class="bottom-sheets">
            <button type="button" class="bt-delete" title="삭제" onclick="deleteContent(event)"><span class="skip">삭제</span></button>
        </div>
    </div>
`;

const multipleHTML = `
<div class="frm-area multiple-choice form-div">
  <div class="inp-group">
    <i class="number"></i>
    <label class="skip">질문 제목</label><input type="text" name="" class="sub_subject" placeholder="질문 제목을 입력해주세요.">
    <ol>
      <li>
        <span class="ctm-check"><input type="checkbox" name="each" value="1"><label class="skip">객관식 1</label></span>
        <span class="inp"><label class="skip">객관식 1 내용</label><input type="text" class="q1" name="q1" placeholder="1. 객관식 내용을 입력하세요."></span>
      </li>
      <li>
        <span class="ctm-check"><input type="checkbox" name="each" value="2"> <label class="skip">객관식 2</label></span>
        <span class="inp"><label class="skip">객관식 2 내용</label> <input type="text" class="q2" name="q2"  placeholder="2. 객관식 내용을 입력하세요."></span>
      </li>
      <li>
        <span class="ctm-check"><input type="checkbox" name="each" value="3"> <label class="skip">객관식 3</label></span>
        <span class="inp"><label class="skip">객관식 3 내용</label> <input type="text" class="q3" name="q3"  placeholder="3. 객관식 내용을 입력하세요."></span>
      </li>
      <li>
        <span class="ctm-check"><input type="checkbox" name="each" value="4"> <label class="skip">객관식 4</label></span>
        <span class="inp"><label class="skip">객관식 4 내용</label> <input type="text" class="q4" name="q4" placeholder="4. 객관식 내용을 입력하세요."></span>
      </li>
      <li>
        <span class="ctm-check"><input type="checkbox" name="each" value="5"> <label class="skip">객관식 5</label></span>
        <span class="inp"><label class="skip">객관식 5 내용</label> <input type="text" class="q5" name="q5"  placeholder="5. 객관식 내용을 입력하세요."></span>
      </li>
    </ol>
  </div>
  <div class="frm-upload">
    <!-- 이미지 미등록 -->
    <div id="img-view">
      <span class="not-img"><img src="../image/icon/gallery-remove.svg" alt=""></span>
    </div>
    <!-- //이미지 미등록 -->
    <label for="file">이미지 등록하기</label> <input type="file" name="" id="file">
  </div>
  <div class="bottom-sheets">
    <button type="button" class="bt-delete" title="삭제" onclick="deleteContent(event)"><span class="skip">삭제</span></button>
  </div>
</div>
`;

const emptyHTML = `
<div class="not-result" id="not-result">
    <i class="ico"></i>
    <p>앗 ! 등록된 질문이 없어요.<br>버튼을 클릭하여 질문을 등록해주세요.</p>
    <ul>
        <li><a onclick="appendHtml(subjectivityHTML)" class="st-ico"><i class="ico i-short-answer"></i> <span>주관식 문항</span></a></li>
        <li><a onclick="appendHtml(multipleHTML)" class="st-ico"><i class="ico i-multiple"></i> <span>객관식 문항</span></a></li>
        </ul>
</div>
`;

function appendHtml (html) { // 문한 컨텐츠 추가
    formEmptyCheck();
    $("#first_content").append(html);
    updateNumbering()
}

function deleteContent (event) { // 문항 컨텐츠 삭제
    $(event.target).closest('.frm-area').remove();
    let formDivElements = document.querySelectorAll('.form-div');
    if (formDivElements.length < 1) $("#first_content").prepend(emptyHTML)
    else updateNumbering();
}

function formEmptyCheck () { // empty 문항 체크
    let elementToRemove = document.getElementById("not-result");
    if (elementToRemove) elementToRemove.parentNode.removeChild(elementToRemove);
}

function updateNumbering () { // 문항 넘버링
    let formDivs = document.querySelectorAll('.inner#first_content .form-div');
    formDivs.forEach(function (formDiv, index) {
        formDiv.querySelector('.number').textContent = index + 1;
    });
};

function extractDataFromContent (contentElement, index) {
    if (contentElement.classList.contains('short-answer')) {
        return new Question(0, 1, index, contentElement.querySelector('.sub_subject').value, contentElement.querySelector('.sub_explain').value, null, null);
    } else if (contentElement.classList.contains('multiple-choice')) {
        let count = 0;
        const arr = ['q1', 'q2', 'q3', 'q4', 'q5'];
        const answer = [];
        const question = [];

        for (let e of arr) {
            const checkbox = contentElement.querySelector(`input[name="each"][value="${arr.indexOf(e) + 1}"]`);
            const inputValue = contentElement.querySelector(`.${e}`).value;
            if (inputValue) {
                count++;
                question.push(inputValue);
                answer.push(checkbox.checked);
            }
        }

        return new Question(1, count, index, contentElement.querySelector('.sub_subject').value, null, question, answer);
    }
};

function resetDate () {
    $('#startDate').val(defaultBeginDate);
    $('#endDate').val(defaultEndDate);
    beginDt = defaultBeginDate;
    endDt = defaultEndDate
}

function isBeginDtOverEndDt (beginDt, endDt) {
    if (endDt < beginDt) {
        alert('종료 날짜는 시작 날짜보다 늦게 설정해야 합니다.');
        resetDate(defaultBeginDate, defaultEndDate)
        return false;
    }
    return true;
}

function isPrevToday (beginDt, endDt) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (beginDt < today || endDt < today) {
        alert('날짜는 오늘 날짜 이상으로 설정해야 합니다.');
        resetDate(defaultBeginDate, defaultEndDate)
        return false;
    }
    return true;
}

function registerData () {
    const request = setRequestData(1)
    if (validateRequestData(request)) register(request)
}

function tempRegisterData () {
    const request = setRequestData(0)
    if (validateRequestData(request)) register(request)
}

function setRequestData (status) {
    let title = document.getElementById("subject").value;
    let detail = document.getElementById("explain").value;
    let question = [];
    let formDivs = document.querySelectorAll('.inner#first_content .form-div');
    formDivs.forEach((formDiv, index) => { question.push(extractDataFromContent(formDiv, index)); });
    return new Form(formType, title, detail, beginDt, endDt, logUrl, themaUrl, question, status);
}

function validateRequestData(request) {
    console.log(request)
    // 유효성 검사 처리
    return false;
}

function register (request) {
    FORM_SUBMIT_API(request).then(res => {
        console.log(res)
        alert('등록')
    })
}

function validateCheckbox(element) {
    let checkbox = $(element).find('input[type="checkbox"]');
    let inputField = $(element).find('input[type="text"]');
    let inputValue = inputField.val();

    if (inputValue === "") {
        checkbox.prop("checked", false);
        return false;
    }
    return true;
}

let formType, logUrl, themaUrl, beginDt, endDt
const today = new Date();
const today_7 = new Date(today);

today_7.setDate(today_7.getDate() + 7);
const defaultBeginDate = today.toISOString().split('T')[0];
const defaultEndDate = today_7.toISOString().split('T')[0];

$(document).ready(() => { // 초기값 설정
    $(".bt-delete").on("click", deleteContent);
    $("#first_content").prepend(emptyHTML)

    formType = $('input[name="formType"]:checked').val();
    logUrl = $('input[name="logoType"]:checked').val();
    themaUrl = $('input[name="themeType"]:checked').val();

    $('input[name="formType"]').change(function () { formType = $(this).val(); }); // 폼형태
    $('input[name="logoType"]').change(function()  { logUrl = $(this).val(); }); // 로고
    $('input[name="themeType"]').change(function() { themaUrl = $(this).val(); }); // 테마
    $('input[type="checkbox"]').on('click', function () {
        if (!validateCheckbox($(this).closest('li'))) {
            alert("객관식 내용을 입력해주세요.");
            return false
        }
    });
    $('input[type="text"]').on('input', function () {
        validateCheckbox($(this).closest('li'));
    });

    resetDate();

    $('#startDate, #endDate').change(function () { // 날짜 선택 변경 시 이벤트 처리
        beginDt = $('#startDate').val();
        endDt = $('#endDate').val();
        if (!isBeginDtOverEndDt(new Date(beginDt+ 'T00:00:00Z'), new Date( endDt + 'T00:00:00Z'))) return;
        if (!isPrevToday(new Date(beginDt + 'T00:00:00Z'), new Date( endDt + 'T00:00:00Z'))) return;
    });

})

$(window).load(() => {
    ESSENTIAL_LOGIN()

})


class Form {
    type;
    title;
    detail;
    beginDt;
    endDt;
    questionCount;
    status;
    maxRespondent;
    logoUrl;
    themaUrl;
    question;

    constructor(type, title, detail, beginDt, endDt, logUrl, themaUrl, question, status) {
        this.type = type;
        this.title= title;
        this.detail = detail;
        this.beginDt = beginDt;
        this.endDt = endDt;
        this.logoUrl = logUrl;
        this.themaUrl = themaUrl;
        this.question = question;
        this.questionCount = question ? question.length : 0
        this.maxRespondent = 0;
        this.status = status
    }
}

class Question {
    type;
    order;
    title;
    placeholder;
    imageUrl;
    detail;
    count;
    answer;

    constructor(type, count, order, title, placeholder, detail, answer) {
        this.type = type;
        this.count = count;
        this.order = order;
        this.title = title;
        this.placeholder = placeholder;
        this.detail = detail;
        this.answer = answer;
    }
}
