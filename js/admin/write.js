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
        <span class="ctm-radio"><input type="radio" name="each" value="1"> <label class="skip">객관식 1</label></span>
        <span class="inp"><label class="skip">객관식 1 내용</label> <input type="text" class="q1" name="q1" value="" placeholder="1. 객관식 내용을 입력하세요."></span>
      </li>
      <li>
        <span class="ctm-radio"><input type="radio" name="each" value="2"> <label class="skip">객관식 2</label></span>
        <span class="inp"><label class="skip">객관식 2 내용</label> <input type="text" class="q2" name="q2" value="" placeholder="2. 객관식 내용을 입력하세요."></span>
      </li>
      <li>
        <span class="ctm-radio"><input type="radio" name="each" value="3"> <label class="skip">객관식 3</label></span>
        <span class="inp"><label class="skip">객관식 3 내용</label> <input type="text" class="q3" name="q3" value="" placeholder="3. 객관식 내용을 입력하세요."></span>
      </li>
      <li>
        <span class="ctm-radio"><input type="radio" name="each" value="4"> <label class="skip">객관식 4</label></span>
        <span class="inp"><label class="skip">객관식 4 내용</label> <input type="text" class="q4" name="q4" value="" placeholder="4. 객관식 내용을 입력하세요."></span>
      </li>
      <li>
        <span class="ctm-radio"><input type="radio" name="each" value="5"> <label class="skip">객관식 5</label></span>
        <span class="inp"><label class="skip">객관식 5 내용</label> <input type="text" class="q5" name="q5" value="" placeholder="5. 객관식 내용을 입력하세요."></span>
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
        <li><a onclick="addSubjectivity()" class="st-ico"><i class="ico i-short-answer"></i> <span>주관식 문항</span></a></li>
        <li><a onclick="addMultipleChoice()" class="st-ico"><i class="ico i-multiple"></i> <span>객관식 문항</span></a></li>
        </ul>
</div>
`;

const addSubjectivity = () => {
    formEmptyCheck();
    $("#first_content").append(subjectivityHTML);
    updateNumbering()
}

const addMultipleChoice = () => {
    formEmptyCheck();
    $("#first_content").append(multipleHTML);
    updateNumbering()
}

// 컨텐츠 삭제 이벤트
const deleteContent = (event) => {
    $(event.target).closest('.frm-area').remove();
    let formDivElements = document.querySelectorAll('.form-div');
    if(formDivElements.length < 1) {
        formEmpty();
    }else {
        updateNumbering();
    }
}

// 비어있을 때
const formEmpty = () => { $("#first_content").prepend(emptyHTML) }

// 문항 생성 시 empty form 제거
const formEmptyCheck = () => {
    let elementToRemove = document.getElementById("not-result");
    if (elementToRemove) {
        elementToRemove.parentNode.removeChild(elementToRemove);
    }
}

let formType, logUrl, themaUrl, beginDt, endDt

// 넘버링 로직
const updateNumbering = () => {
    let formDivs = document.querySelectorAll('.inner#first_content .form-div');
    formDivs.forEach(function (formDiv, index) {
        let numberElement = formDiv.querySelector('.number');
        numberElement.textContent = index + 1;
    });
};

const init = () => {
    // 초기값 설정
    formType = $('input[name="formType"]:checked').val();
    logUrl = $('input[name="logoType"]:checked').val();
    themaUrl = $('input[name="themeType"]:checked').val();

    // 오늘 날짜를 구합니다.
    const today = new Date();

    // 종료일자를 오늘로부터 7일 뒤로 설정합니다.
    const defaultEndDate = new Date(today);
    defaultEndDate.setDate(defaultEndDate.getDate() + 7);

    // 오늘 날짜를 'yyyy-MM-dd' 형식의 문자열로 변환합니다.
    const formattedCurrentDate = today.toISOString().split('T')[0];
    const formattedEndDate = defaultEndDate.toISOString().split('T')[0];

    const resetDate = () => {
        $('#startDate').val(formattedCurrentDate);
        $('#endDate').val(formattedEndDate);
        beginDt = formattedCurrentDate;
        endDt = formattedEndDate
    }

    resetDate();

    const isRightDate = (beginDt, endDt) => {
        if (endDt < beginDt) {
            alert('종료 날짜는 시작 날짜보다 늦게 설정해야 합니다.');
            resetDate()
            return false;
        }
        return true;
    }

    const isRightDate2 = (beginDt, endDt) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (beginDt < today || endDt < today) {
            alert('날짜는 오늘 날짜 이상으로 설정해야 합니다.');
            resetDate()
            return false;
        }
        return true;
    }

    // 폼형태
    $('input[name="formType"]').change(function () { formType = $(this).val(); });

    // 로고
    $('input[name="logoType"]').change(function()  { logUrl = $(this).val(); });

    // 테마
    $('input[name="themeType"]').change(function() { themaUrl = $(this).val(); });
    

    // 날짜 선택 변경 시 이벤트 처리
    $('#startDate, #endDate').change(() => {
        beginDt = $('#startDate').val();
        endDt = $('#endDate').val();
        if (!isRightDate(new Date(beginDt+ 'T00:00:00Z'), new Date( endDt + 'T00:00:00Z'))) return;
        if (!isRightDate2(new Date(beginDt + 'T00:00:00Z'), new Date( endDt + 'T00:00:00Z'))) return;
    });

}

const extractDataFromContent = (contentElement, index) => {
    if (contentElement.classList.contains('short-answer')) {
        return new Question(0, 1, index, contentElement.querySelector('.sub_subject').value, contentElement.querySelector('.sub_explain').value, null);
    } else if (contentElement.classList.contains('multiple-choice')) {
        let count = 0;
        const arr = ['q1','q2','q3','q4','q5'];
        for(let e of arr) if (contentElement.querySelector(`.${e}`).value) count++
        return new Question(1, count, index, contentElement.querySelector('.sub_subject').value, null, JSON.stringify({
            q1: contentElement.querySelector('.q1').value,
            q2: contentElement.querySelector('.q2').value,
            q3: contentElement.querySelector('.q3').value,
            q4: contentElement.querySelector('.q4').value,
            q5: contentElement.querySelector('.q5').value,
        }));
    }
};

const registerData = () => {
    const request = setReq(1)
    register(request)
}

const tempRegisterData = () => {
    const request = setReq(0)
    register(request)
}

const setReq = (status) => {
    let title = document.getElementById("subject").value;
    let detail = document.getElementById("explain").value;
    let question = [];
    let formDivs = document.querySelectorAll('.inner#first_content .form-div');
    formDivs.forEach((formDiv, index) => { question.push(extractDataFromContent(formDiv, index)); });
    return new Form(formType, title, detail, beginDt, endDt, logUrl, themaUrl, question, status);
}

const register = (request) => {
    FORM_SUBMIT_API(request).then(res => {
        console.log(res)
        alert('등록')
    })
}

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

    constructor(type, count, order, title, placeholder, detail) {
        this.type = type;
        this.count = count;
        this.order = order;
        this.title = title;
        this.placeholder = placeholder;
        this.detail = detail;
    }

}

$(document).ready(() => {
    $(".bt-delete").on("click", deleteContent);
    formEmpty()
    init()

})

$(window).load(() => {
    ESSENTIAL_LOGIN()

})