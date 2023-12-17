const subjectivityHTML = `
    <div class="frm-area short-answer form-div">
        <div class="inp-group">
            <i class="number"></i>
            <label for="subject" class="skip">질문 제목</label><input type="text" name="" id="subject" placeholder="질문 제목을 입력해주세요.">
            <label for="explain" class="skip">질문 내용</label><input type="text" name="" id="explain" placeholder="주관식 질문 창에 보일 문구를 입력해주세요.">
        </div>
        <div class="frm-upload">
            <!-- 이미지 등록 -->
            <canvas id="img-view"></canvas>
            <!-- //이미지 등록 -->
            <label for="file">이미지 등록하기</label> <input type="file" name="" id="file">
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
    <label for="subject" class="skip">질문 제목</label><input type="text" name="" id="subject" placeholder="질문 제목을 입력해주세요.">
    <ol>
      <li>
        <span class="ctm-radio"><input type="radio" name="" id="que1"> <label for="que1" class="skip">객관식 1</label></span>
        <span class="inp"><label for="" class="skip">객관식 1 내용</label> <input type="text" id="q1" name="" value="" placeholder="1. 객관식 내용을 입력하세요."></span>
      </li>
      <li>
        <span class="ctm-radio"><input type="radio" name="" id="que2"> <label for="que2" class="skip">객관식 2</label></span>
        <span class="inp"><label for="" class="skip">객관식 2 내용</label> <input type="text" id="q2" name="" value="" placeholder="2. 객관식 내용을 입력하세요."></span>
      </li>
      <li>
        <span class="ctm-radio"><input type="radio" name="" id="que3"> <label for="que3" class="skip">객관식 3</label></span>
        <span class="inp"><label for="" class="skip">객관식 3 내용</label> <input type="text" id="q3" name="" value="" placeholder="3. 객관식 내용을 입력하세요."></span>
      </li>
      <li>
        <span class="ctm-radio"><input type="radio" name="" id="que4"> <label for="que4" class="skip">객관식 4</label></span>
        <span class="inp"><label for="" class="skip">객관식 4 내용</label> <input type="text" id="q4" name="" value="" placeholder="4. 객관식 내용을 입력하세요."></span>
      </li>
      <li>
        <span class="ctm-radio"><input type="radio" name="" id="que5"> <label for="que5" class="skip">객관식 5</label></span>
        <span class="inp"><label for="" class="skip">객관식 5 내용</label> <input type="text" id="q5" name="" value="" placeholder="5. 객관식 내용을 입력하세요."></span>
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
    let formTypeValue = $('input[name="formType"]:checked').val();
    let logoTypeValue = $('input[name="logoType"]:checked').val();
    let themeTypeValue = $('input[name="themeType"]:checked').val();

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
    }

    resetDate();

    const isRightDate = (startDate, endDate) => {
        if (endDate < startDate) {
            alert('종료 날짜는 시작 날짜보다 늦게 설정해야 합니다.');
            resetDate()
            return false;
        }
        return true;
    }

    const isRightDate2 = (startDate, endDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (startDate < today || endDate < today) {
            alert('날짜는 오늘 날짜 이상으로 설정해야 합니다.');
            resetDate()
            return false;
        }
        return true;
    }

    // 폼형태
    $('input[name="formType"]').change(() => { formTypeValue = $(this).val(); });

    // 로고
    $('input[name="logoType"]').change(() => { logoTypeValue = $(this).val(); });

    // 테마
    $('input[name="themeType"]').change(() => { themeTypeValue = $(this).val(); });

    // 날짜 선택 변경 시 이벤트 처리
    $('#startDate, #endDate').change(() => {
        const startDate = new Date($('#startDate').val() + 'T00:00:00Z');
        const endDate = new Date( $('#endDate').val() + 'T00:00:00Z');
        if (!isRightDate(startDate, endDate)) return;
        if (!isRightDate2(startDate, endDate)) return;
    });

}

const extractDataFromContent = (contentElement, index) => {
    const data = {};

    if (contentElement.classList.contains('short-answer')) {
        data.type = 0;
        data.order = index
        data.title = contentElement.querySelector('#subject').value;
        data.placeholder = contentElement.querySelector('#explain').value;
        data.count = 1;
    } else if (contentElement.classList.contains('multiple-choice')) {
        data.count = 0;
        data.type = 1;
        data.order = index
        data.title = contentElement.querySelector('#subject').value;
        data.detail = JSON.stringify({
            q1: contentElement.querySelector('#q1').value,
            q2: contentElement.querySelector('#q2').value,
            q3: contentElement.querySelector('#q3').value,
            q4: contentElement.querySelector('#q4').value,
            q5: contentElement.querySelector('#q5').value,
        })
        const arr = ['q1','q2','q3','q4','q5'];
        for(let e of arr) {
            if (contentElement.querySelector(`#${e}`).value) data.count++
        }
    }

    return data;
};

const registerData = () => {

    const question = [];
    let formDivs = document.querySelectorAll('.inner#first_content .form-div');

    formDivs.forEach((formDiv, index) => {
        const extractedData = extractDataFromContent(formDiv, index);
        question.push(extractedData);
    });

    console.log(question)

    return question
}

$(document).ready(() => {
    $(".bt-delete").on("click", deleteContent);
    formEmpty()
    init()

})

$(window).load(() => {
    ESSENTIAL_LOGIN()

})