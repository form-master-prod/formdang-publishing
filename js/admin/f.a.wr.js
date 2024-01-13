function subjectHtml() {
    const id = Date.now();
    let html = '';
    html.concat(`<div class="frm-area short-answer form-div">`)
        html.concat(`<div class="inp-group"><i class="number"></i>`)
            html.concat(`<label class="skip">질문 제목</label><input type="text" name="" class="sub_subject" placeholder="질문 제목을 입력해주세요.">`)
            html.concat(`<label class="skip">질문 내용</label><input type="text" name="" class="sub_explain" placeholder="주관식 질문 창에 보일 문구를 입력해주세요.">`)
        html.concat(`</div>`)
        html.concat(imageHtml(id)) // 이미지 등록 html 함수화
        html.concat(`<div class="bottom-sheets">`)
            html.concat(`<button type="button" class="bt-delete" title="삭제" onclick="deleteQuestion(event)"><span class="skip">삭제</span></button>`)
        html.concat(`</div>`)
    html.concat(`</div>`)
    return html;
}

function multipleHtml() {
    const id = Date.now();
    let html = ''
    html.concat(`<div class="frm-area multiple-choice form-div">`)
        html.concat(`<div class="inp-group"><i class="number"></i>`)
            html.concat(`<label class="skip">질문 제목</label><input type="text" name="" class="sub_subject" placeholder="질문 제목을 입력해주세요.">`)
            html.concat(`<ol class="subject-valid">`)
            for (let i=1; i <=5 ; i++) { // 1~5문항 loop 생성
                const id = 'q' + i;
                html.concat(`<li>`)
                    html.concat(`<span class="ctm-check-span">`)
                    html.concat(`<input type="checkbox" class="ctm-check" name="each" value="${i}"><label class="skip">객관식 ${i}</label>`)
                    html.concat(`</span>`)
                    html.concat(`<span class="inp" style="width: 100%">`)
                    html.concat(`<label class="skip">객관식 ${i} 내용</label><input type="text" class="${id}" name="${id}" placeholder="${i}. 객관식 내용을 입력하세요.">`)
                    html.concat(`</span>`)
                html.concat(`</li>`)
            }
           html.concat(`</ol>`)
        html.concat(`</div>`)
        html.concat(imageHtml(id)) // 이미지 등록 html 함수화
        html.concat(`<div class="bottom-sheets">`)
            html.concat(`<button type="button" class="bt-delete" title="삭제" onclick="deleteQuestion(event)"><span class="skip">삭제</span></button>`)
        html.concat(`</div>`)
    html.concat(`</div>`)
    return html;
}

function imageHtml(id) {
    let html = ''
    html.concat(`<div class="frm-upload">`)
        html.concat(`<canvas id="img-view-n${id}" class="img-view" style="display: none"></canvas>`) // 이미지 등록
        html.concat(`<div id="img-view-p${id}" class="img-view">`)
            html.concat(`<span class="not-img"><img src="../image/icon/gallery-remove.svg" alt=""></span>`)
        html.concat(`</div>`)
        html.concat(`<label for="f${id}">이미지 등록하기</label> <input type="file" name="" id="f${id}" class="file-input" onchange="previewImage('${id}')">`)
    html.concat(`</div>`)
    return html;
}

function emptyHtml() {
    let html = ''
    html.concat(`<div class="not-result" id="not-result">`)
        html.concat(`<i class="ico"></i><p>앗 ! 등록된 질문이 없어요.<br>버튼을 클릭하여 질문을 등록해주세요.</p>`)
        html.concat(`<ul>`)
            html.concat(`<li><a onclick="appendQuestion(subjectHtml())" class="st-ico"><i class="ico i-short-answer"></i> <span>주관식 문항</span></a></li>`)
            html.concat(`<li><a onclick="appendQuestion(multipleHtml())" class="st-ico"><i class="ico i-multiple"></i> <span>객관식 문항</span></a></li>`)
        html.concat(`</ul>`)
    html.concat(`</div>`)
    return html;
}

function appendQuestion (html) { // 문한 컨텐츠 추가
    removeEmptyHtml(); // empty html 제거
    $("#first_content").append(html); // 문항 html append
    updateNumbering() // 넘버링 업데이트
}

function deleteQuestion (event) { // 문항 컨텐츠 삭제
    $(event.target).closest('.frm-area').remove(); // 삭제
    appendEmptyHtml(); // empty html 처리
}

function appendEmptyHtml() { // empty html 처리
    let formDivElements = document.querySelectorAll('.form-div'); // 문항 class
    if (formDivElements.length < 1) $("#first_content").prepend(emptyHtml()); // 문항이 없는 경우 empty html append 처리
    else updateNumbering(); // 넘버링 업데이트
}

function removeEmptyHtml () { // empty 문항 제거
    let notResultElement = document.getElementById("not-result");
    if (notResultElement) notResultElement.parentNode.removeChild(notResultElement); // empty html 있는 경우 삭제
}

function updateNumbering () { // 문항 넘버링
    let questions = document.querySelectorAll('.inner#first_content .form-div');
    questions.forEach(function (e, i) {
        e.querySelector('.number').textContent = i + 1;
    });
};

function previewImage(inputId) {
    const input = document.getElementById("f" + inputId);
    const canvasId = 'img-view-n' + inputId;
    const canvas = document.getElementById(canvasId);
    const context = canvas.getContext('2d');
    const divElement = document.getElementById('img-view-p' + inputId)
    canvas.style.display = 'block'; // 예시로 보여주는 방식, 실제로 사용하는 방식에 따라 다를 수 있음
    divElement.style.display = 'none';

    const file = input.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;

            img.onload = function () {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
        };

        reader.readAsDataURL(file);
    }
}


function extractDataFromContent (contentElement, index) {
    let file;
    const fileInputs = contentElement.querySelectorAll('.file-input');
    fileInputs.forEach((fileInput => { file = fileInput.files[0]; }));

    if (contentElement.classList.contains('short-answer')) {
        return new Question(0, 1, index, contentElement.querySelector('.sub_subject').value, contentElement.querySelector('.sub_explain').value, null, null, file);
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
        return new Question(1, count, index, contentElement.querySelector('.sub_subject').value, null, question, answer, file);
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

async function registerData () {
    if (doubleSubmitPrevent) return
    doubleSubmitPrevent = true;
    const request = setRequestData(status)
    if (validateRequestData(request)) {
        await uploadImage(request)
        await register(request)
        doubleSubmitPrevent = false
    }
    else {
        closeModal()
        doubleSubmitPrevent = false;
    }
}

function setRequestData (status) {
    let logoFile;
    let logo = document.getElementById("flogoFile");
    let title = document.getElementById("subject").value;
    let detail = document.getElementById("explain").value;
    let question = [];
    let formDivs = document.querySelectorAll('.inner#first_content .form-div');
    formDivs.forEach((formDiv, index) => { question.push(extractDataFromContent(formDiv, index)); });
    if (logo.files[0]) {
        logoFile = logo.files[0];
    } else {
        logoFile = DEFAULT_LOGO_URL;
    }
    return new Form(formType, title, detail, formatDateToyyyyMMdd(beginDt), formatDateToyyyyMMdd(endDt), logoFile, themaUrl, question, status);
}

function validateRequestData(request) {
    let olElements = document.querySelectorAll('.subject-valid');
    let alertShown = false;

    for (let i = 0; i < olElements.length; i++) {
        let checkboxes = olElements[i].querySelectorAll('.ctm-check');
        let isChecked = Array.from(checkboxes).some(function (checkbox) {
            return checkbox.checked;
        });
        if (!isChecked && !alertShown) {
            alert('하나 이상의 답안을 체크해주세요.');
            checkboxes[0].focus();
            alertShown = true;
        }
    }
    if(alertShown) {
        return false;
    }

    if (!request.beginDt || !request.endDt) {
        alert('날짜기입 오류')
        return false;
    } else if (!request.title) {
        alert('폼 제목 오류')
        return false;
    } else if (!request.detail) {
        alert('폼 설명 누락')
        return false;
    } else if (!request.question || request.question.length == 0) {
        alert('등록 질문 오류')
        return false;
    }

    for (let q of request.question) {
        if (q.type == 0) {
            if (!q.title) {
                alert('주관식 타이틀 누락')
                return false;
            }
        } else if (q.type == 1) {
            if (!q.title) {
                alert('객관식 타이틀 누락')
                return false;
            } else if(!q.detail || q.detail == 0) {
                alert('객관식 내용 누락')
                return false;
            }

        }
    }

    return true;
}

async function uploadImage(request) {
    if (request.question) {
        for (const question of request.question) {
            if (question.file) {
                question.imageUrl = await upload(question.file);
            }
            delete question.file
        }
    }

    if (request.logoUrl && request.logoUrl instanceof File) {
        request.logoUrl = await upload(request.logoUrl);
    }
}

async function  register (request) {
    closeModal()
    await fsa(request).then(res => {
        if (res && res.resultCode == '0') {
            alert('등록 성공')
            window.location.replace(PAGE.ADMIN_MAIN)
        } else {
            alert('등록 실패')
        }
    })
}

async function upload (file) {
    let form = new FormData();
    form.append("file", file); // 파일 formdata
    return await ufa(form).then(res => {
        if (res && res.resultCode == '0') {
            return res.file.path;
        } else {
            return null;
        }
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

function openModal(type) {
    let element = document.getElementById('modal');
    let element1 = document.getElementById("modal_title");
    let element2 = document.getElementById("modal_content");
    let element3 = document.getElementById("modal_ico");

    if (type == 0) {
        element1.innerText = '임시 저장';
        element2.innerText = '작성한 설문을 임시 저장 하시겠습니까?';
        element3.style.display = "flex";
    } else if (type == 1) {
        element1.innerText = '등록 하기';
        element2.innerText = '설문을  등록하시겠습니까?';
        element3.style.display = "none";
    }
    element.style.display = "flex";
    document.body.style.overflow = "hidden";

    status = type;
}

function closeModal() {
    let element = document.getElementById('modal');
    element.style.display = "none";
    document.body.style.overflow = "auto";
}

function formatDateToyyyyMMdd(inputDateString) {
    // 문자열로부터 Date 객체 생성
    var inputDate = new Date(inputDateString);

    if (isNaN(inputDate.getTime())) {
        console.error('Invalid date string');
        return '';
    }

    // 날짜 구성 요소 가져오기
    var year = inputDate.getFullYear();
    var month = ('0' + (inputDate.getMonth() + 1)).slice(-2); // 월은 0부터 시작하므로 1을 더하고 2자리로 포맷
    var day = ('0' + inputDate.getDate()).slice(-2); // 날짜를 2자리로 포맷

    // yyyyMMdd 형식으로 조합
    var formattedDate = year + month + day;

    return formattedDate;
}

let formType, logUrl, themaUrl, beginDt, endDt, status
let doubleSubmitPrevent = false;
const today = new Date();
const today_7 = new Date(today);

today_7.setDate(today_7.getDate() + 7);
const defaultBeginDate = today.toISOString().split('T')[0];
const defaultEndDate = today_7.toISOString().split('T')[0];

$(document).ready(() => { // 초기값 설정
    $(".bt-delete").on("click", deleteQuestion);
    appendEmptyHtml();

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


    // 객관식 항목이 빈값인데 체크한 경우
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('ctm-check')) {
          let listItem = event.target.closest('li');
          let inputElement = listItem.querySelector('input[type="text"]');
          let checkbox = listItem.querySelector('input[type="checkbox"]');
          let inputValue = inputElement.value.trim();
          if (inputValue === '') {
            alert("객관식 항목이 비어있습니다.");  // 모달로 변경
            checkbox.checked = false;
            event.preventDefault();
            return false;
          }
        }
  });
    
    // 체크해놓은 후 객관식 항목을 다시 빈칸 만든 경우
    document.addEventListener('input', function(event) {
		let inputArr = ['q1', 'q2', 'q3', 'q4', 'q5']
		if (event.target.type === 'text' && inputArr.includes(event.target.name)) {
		  let listItem = event.target.closest('li');
		  if (listItem) {
			let checkbox = listItem.querySelector('input[type="checkbox"]');
			if (checkbox) {
			  if (event.target.value.trim() === '') {
				checkbox.checked = false;  // 객관식 항목이 빈칸이 되버리면 체크 해제
			  }
			}
		  }
		}
  });

    const dynamicImage = document.getElementById("defaultLogo");
    dynamicImage.src = DEFAULT_LOGO_URL;

    essentialLogin();

})

$(window).load(() => {


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
    file;

    constructor(type, count, order, title, placeholder, detail, answer, file) {
        this.type = type;
        this.count = count;
        this.order = order;
        this.title = title;
        this.placeholder = placeholder;
        this.detail = detail;
        this.answer = answer;
        this.file = file;
    }
}
