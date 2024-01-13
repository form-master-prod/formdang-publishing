let formType, logUrl, themaUrl, beginDt, endDt, status
let doubleSubmitPrevent = false, modal_type = 'R';
const today = new Date();
const today_7 = new Date(today);
today_7.setDate(today_7.getDate() + 7);

class Form {
    type; title; detail; beginDt; endDt; questionCount; status; maxRespondent; logoUrl; themaUrl; question;
    constructor(type, title, detail, beginDt, endDt, logUrl, themaUrl, question, status) {
        this.type = type; this.title= title; this.detail = detail; this.beginDt = beginDt; this.endDt = endDt; this.logoUrl = logUrl; this.themaUrl = themaUrl; this.question = question;
        this.questionCount = question ? question.length : 0; this.maxRespondent = 0; this.status = status
    }
}

class Question {
    type; order; title; placeholder; imageUrl; detail; count; answer; file;
    constructor(type, count, order, title, placeholder, detail, answer, file) {
        this.type = type; this.count = count; this.order = order; this.title = title; this.placeholder = placeholder; this.detail = detail; this.answer = answer; this.file = file;
    }
}

function subjectHtml() {
    const id = Date.now();
    let html = '';
    html =
    html.concat(`<div class="frm-area short-answer form-div">`)
            .concat(`<div class="inp-group"><i class="number"></i>`)
                .concat(`<label class="skip">질문 제목</label><input type="text" name="" class="sub_subject" placeholder="질문 제목을 입력해주세요.">`)
                .concat(`<label class="skip">질문 내용</label><input type="text" name="" class="sub_explain" placeholder="주관식 질문 창에 보일 문구를 입력해주세요.">`)
            .concat(`</div>`)
            .concat(imageHtml(id)) // 이미지 등록 html 함수화
            .concat(`<div class="bottom-sheets">`)
                .concat(`<button type="button" class="bt-delete" title="삭제" onclick="deleteQuestion(event)"><span class="skip">삭제</span></button>`)
            .concat(`</div>`)
        .concat(`</div>`)
    return html;
}

function multipleHtml() {
    const id = Date.now();
    let html = ''
    html =
        html.concat(`<div class="frm-area multiple-choice form-div">`)
            .concat(`<div class="inp-group"><i class="number"></i>`)
                .concat(`<label class="skip">질문 제목</label><input type="text" name="" class="sub_subject" placeholder="질문 제목을 입력해주세요.">`)
                .concat(`<ol class="subject-valid">`);
            for (let i=1; i <=5 ; i++) { // 1~5문항 loop 생성
                const id = 'q' + i;
                html =
                    html.concat(`<li>`)
                            .concat(`<span class="ctm-check-span">`)
                            .concat(`<input type="checkbox" class="ctm-check" name="each" value="${i}"><label class="skip">객관식 ${i}</label>`)
                            .concat(`</span>`)
                            .concat(`<span class="inp" style="width: 100%">`)
                            .concat(`<label class="skip">객관식 ${i} 내용</label><input type="text" class="${id}" name="${id}" placeholder="${i}. 객관식 내용을 입력하세요.">`)
                            .concat(`</span>`)
                        .concat(`</li>`)
            }
    html =
        html.concat(`</ol>`)
            .concat(`</div>`)
            .concat(imageHtml(id)) // 이미지 등록 html 함수화
            .concat(`<div class="bottom-sheets">`)
                .concat(`<button type="button" class="bt-delete" title="삭제" onclick="deleteQuestion(event)"><span class="skip">삭제</span></button>`)
            .concat(`</div>`)
     .concat(`</div>`)
    return html;
}

function imageHtml(id) {
    let html = ''
    html =
        html.concat(`<div class="frm-upload">`)
                .concat(`<canvas id="img-canvas-${id}" class="img-view" style="display: none"></canvas>`) // 이미지 등록
                .concat(`<div id="img-div-${id}" class="img-view">`)
                    .concat(`<span class="not-img"><img src="../image/icon/gallery-remove.svg" alt=""></span>`)
                .concat(`</div>`)
                .concat(`<label for="img-${id}">이미지 등록하기</label> <input type="file" name="" id="img-${id}" class="file-input" onchange="previewImg('${id}')">`)
            .concat(`</div>`)
    return html;
}

function emptyHtml() {
    let html = ''
    html =
        html.concat(`<div class="not-result" id="not-result">`)
            .concat(`<i class="ico"></i><p>앗 ! 등록된 질문이 없어요.<br>버튼을 클릭하여 질문을 등록해주세요.</p>`)
            .concat(`<ul>`)
                .concat(`<li><a onclick="appendQuestion(subjectHtml())" class="st-ico"><i class="ico i-short-answer"></i> <span>주관식 문항</span></a></li>`)
                .concat(`<li><a onclick="appendQuestion(multipleHtml())" class="st-ico"><i class="ico i-multiple"></i> <span>객관식 문항</span></a></li>`)
            .concat(`</ul>`)
        .concat(`</div>`)
    return html;
}

function modalHtml() {
    let html = ''
    html =
        html.concat(`<div class="window_alert" id="modal_layer">`)
                .concat(`<div class="modal-layer">`)
                    .concat(`<div class="inner">`)
                        .concat(`<i class="ico" id="modal-ico"></i>`)
                        .concat(`<h2 class="skip" id="modal-title"></h2>`)
                        .concat(`<p id="modal-content"></p>`)
                    .concat(`</div>`)
                    .concat(`<div class="bt-wrap">`)
                        .concat(`<button type="button" class="st-ico" id="modal-cancel" onclick="closeModal()"><span>취소</span></button>`)
                        .concat(`<button type="button" class="st-fill" id="modal-ok" onclick="okModal()"><span></span></button>`)
                .concat(`</div>`)
            .concat(`</div>`)
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

function appendModalHtml() { // 모달 append
    let modalElement = document.getElementById('modal_layer')
    if (!modalElement)  $("#wrap").after(modalHtml());
}

function previewImg(id) { // 이미지 미리보기 처리
    const imgId = "img-" + id;
    const canvasId = "img-canvas-" + id;
    const divId = "img-div-" + id
    const input = document.getElementById(imgId);
    const canvas = document.getElementById(canvasId);
    const div = document.getElementById(divId)
    const context = canvas.getContext('2d');
    const file = input.files[0];
    readFile(file, canvas, div, context) // 파일 읽기 후 미리보기 설정
}

function readFile(file, canvas, div, context) { // 파일 읽기 후 미리보기 설정
    if (!file) return
    const reader = new FileReader();
    canvas.style.display = 'block'; // 예시로 보여주는 방식, 실제로 사용하는 방식에 따라 다를 수 있음
    div.style.display = 'none';
    reader.onload = function (e) { // 파일 리드 후 설정 처리
        const img = new Image();
        img.src = e.target.result;
        img.onload = function () {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
    };
    reader.readAsDataURL(file);
}

function openPopUpWithUser(t) { // 유저 클릭 오픈 팝업 이벤트
    const title = t == 0 ? '임시 저장' : '등록 하기' // 타이틀 설정
    const content = t == 0 ? '작성한 설문을 임시 저장 하시겠습니까?' : '설문을  등록하시겠습니까?'; // 컨텐츠 설정
    const ico = t == 0 ? 'flex' : 'none'; // 이모티콘 on, off 처리
    status = t; // 타입 설정 (0:임시저장, 1:등록)
    openPopUp(title, content, ico, '예', true, 'R') // 팝업 오픈
}

function openPopUp(t, c, i, o, mc, mt) { // 팝업 오픈
    document.getElementById("modal-title").innerText = t;
    document.getElementById("modal-content").innerText = c;
    document.getElementById("modal-ico").style.display = i;
    document.getElementById('modal_layer').style.display = "flex";
    document.getElementById('modal-ok').innerText = o;
    document.getElementById('modal-cancel').style.display = mc ? 'flex' : 'none';
    modal_type = mt;
    document.body.style.overflow = "hidden";
}

function closeModal() { // 팝업 닫기
    let element = document.getElementById('modal_layer');
    element.style.display = "none";
    document.body.style.overflow = "auto";
}

function okModal() { // 모달 예 클릭
    if (modal_type == 'R') {
        if (doubleSubmitPrevent) return // 중복 클릭 방지
        doubleSubmitPrevent = true;
        startRegisterForm().then(r => { // 등록
            doubleSubmitPrevent = false;
        })
    } else if (modal_type == 'S') {
        window.location.replace(PAGE.ADMIN_MAIN)
    } else if (modal_type == 'C') {
        closeModal();
    }
}

function watchingDate() { // 날짜 선택 변경 시 이벤트 처리
    beginDt = $('#startDate').val();
    endDt = $('#endDate').val();
    const bDt = new Date(beginDt + 'T00:00:00Z');
    const eDt =  new Date(endDt + 'T00:00:00Z');
    if (!isBeginDtOverEndDt(bDt, eDt)) return; // 종료일이 시작일 이후 설정 검사
    if (!isPrevToday(bDt, eDt)) return; // 오늘 날짜 이후 설정
}

function isBeginDtOverEndDt (beginDt, endDt) { // 종료일이 시작일 이후 설정 검사
    if (endDt < beginDt) {
        openPopUp("시간 설정", "종료 날짜는 시작 날짜보다 늦게 설정해야 합니다.", "flex", '닫기', false, 'C') // 팝업 오픈
        resetDate()
        return false;
    }
    return true;
}

function isPrevToday (beginDt, endDt) { // 오늘 날짜 이후 설정
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (beginDt < today || endDt < today) {
        openPopUp("시간 설정", "날짜는 오늘 날짜 이상으로 설정해야 합니다.", "flex", '닫기', false, 'C') // 팝업 오픈
        resetDate()
        return false;
    }
    return true;
}

function resetDate () { // 날짜 리셋 처리
    const bDt = formatDateyyyyMMddWithHyphen(today)
    const eDt = formatDateyyyyMMddWithHyphen(today_7)
    $('#startDate').val(bDt);
    $('#endDate').val(eDt);
    beginDt = bDt;
    endDt = eDt
}


function validateCheckbox(element) { // 이성이 등록
    let checkbox = $(element).find('input[type="checkbox"]');
    let inputField = $(element).find('input[type="text"]');
    let inputValue = inputField.val();

    if (inputValue === "") {
        checkbox.prop("checked", false);
        return false;
    }
    return true;
}


function validateCheckBox() { // 이성이 등록
    if (!validateCheckbox($(this).closest('li'))) {
        alert("객관식 내용을 입력해주세요.");
        return false
    }
}

function validateText() { // 이성이 등록
    validateCheckbox($(this).closest('li'));
}

function validateMultipleChoiceSetting(event) { // 이성이 등록
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
}

function validateMultipleChoiceEmpty(event) { // 이성이 등록
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
}

function setDefaultLogoImg() { // default 로고 이미지 세팅
    const dynamicImage = document.getElementById("img-default-logo");
    dynamicImage.src = DEFAULT_LOGO_URL; // default 로고 이미지 세팅
}

async function startRegisterForm () { // 폼 등록하기
    const request = generateData(status) // 파라미터 만들기
    if (validateRequestData(request)) { // validate 체크
        await uploadImage(request) // 이미지 업로드
        await register(request) // 폼 업로드
    }

}

function generateData(s) { // 데이터 세팅
    let questions = [];
    let logo = document.getElementById("img-logo"); // 로고 element
    let title = document.getElementById("subject").value; // 타이틀
    let detail = document.getElementById("explain").value; // 폼 설명
    let file = logo.files[0] ? logo.files[0] : DEFAULT_LOGO_URL; // 로고 파일
    let arr = document.querySelectorAll('.inner#first_content .form-div');
    arr.forEach((question, idx) => { questions.push(extractData(question, idx)); }); // 질문 리스트 추출
    return new Form(formType, title, detail, formatDateToyyyyMMdd(beginDt), formatDateToyyyyMMdd(endDt), file, themaUrl, questions, s);
}

function extractData (question, idx) { // 질문 리스트 데이터 추출
    let file;
    question.querySelectorAll('.file-input').forEach((e => { file = e.files[0]; }));
    if (question.classList.contains('short-answer')) { // 주관식 처리
        return new Question(0, 1, idx, question.querySelector('.sub_subject').value, question.querySelector('.sub_explain').value, null, null, file);
    } else if (question.classList.contains('multiple-choice')) { // 객관식 처리
        let count = 0; // 질문 개수
        const arr = ['q1', 'q2', 'q3', 'q4', 'q5']; // 인자 class 리스트
        const details = []; // 질문 리스트
        const answer = []; // 답 리스트
        arr.forEach(e => {
            const checkbox = question.querySelector(`input[name="each"][value="${arr.indexOf(e) + 1}"]`); // 체크박스 답
            const detail = question.querySelector(`.${e}`).value; // 입력 질문
            if (detail) {
                details.push(detail);
                answer.push(checkbox.checked);
                count++;
            }
        })
        return new Question(1, count, idx, question.querySelector('.sub_subject').value, null, details, answer, file);
    }
};

function validateRequestData(request) { // 폼 설정 유효성 검사

    if (!request.beginDt || !request.endDt) { // 날짜 검사
        openPopUp("날짜 설정", "날짜를 입력해주세요.", "flex", '닫기', false, 'C') // 팝업 오픈
        return false;
    } else if (!request.title) { // 제목 검사
        openPopUp("폼 제목", "폼 제목을 작성해주세요.", "flex", '닫기', false, 'C') // 팝업 오픈
        return false;
    } else if (!request.detail) { // 폼 내용 검사
        openPopUp("폼 설명", "폼 설명을 작성해주세요.", "flex", '닫기', false, 'C') // 팝업 오픈
        return false;
    } else if (!request.question || request.question.length == 0) { //질문 입력 검사
        openPopUp("질문 설정", "질문을 입력해주세요.", "flex", '닫기', false, 'C') // 팝업 오픈
        return false;
    }

    for (let q of request.question) {
        if (q.type == 0) {
            if (!q.title) { // 주관식 제목 검사
                openPopUp("주관식 설정", "주관식 제목을 입력해주세요.", "flex", '닫기', false, 'C') // 팝업 오픈
                return false;
            }
        } else if (q.type == 1) {
            if (!q.title) { // 객관식 제목 검사
                openPopUp("객관식 설정", "객관식 제목을 입력해주세요.", "flex", '닫기', false, 'C') // 팝업 오픈
                return false;
            } else if(!q.detail || q.detail == 0) { // 객관식 내용 검사
                openPopUp("객관식 내용", "객관식 내용을 입력해주세요.", "flex", '닫기', false, 'C') // 팝업 오픈
                return false;
            }
        }
    }

    return true;
}

async function uploadImage(request) { // 이미지 업로드 처리
    if (request.question) {
        for (const question of request.question) { // 질문 리스트
            if (question.file) question.imageUrl = await upload(question.file);
            delete question.file
        }
    }
    if (request.logoUrl && request.logoUrl instanceof File) { // 로고 파일 등록 (파일경우 default는 url로 스킵)
        request.logoUrl = await upload(request.logoUrl);
    }
}

async function register(request) { // 폼 등록
    await fsa(request).then(res => {
        console.log(res)
        if (res && res.resultCode == '0') {
            openPopUp("등록 성공", "등록에 성공했습니다. 메인 페이지로 이동합니다.", "none", '확인', false, 'S') // 팝업 오픈
        } else {
            openPopUp("등록 실패", "폼 등록에 실패하였습니다.", "flex", '닫기', false, 'C') // 팝업 오픈
        }
    })
        .catch(e => {
            openPopUp("등록 실패", "폼 등록에 실패하였습니다.", "flex", '닫기', false, 'C') // 팝업 오픈
        })
}

$(document).ready(() => { // 초기 설정
    essentialLogin(); // 로그인 여부 검사
    appendModalHtml(); // 모달 붙이기
    appendEmptyHtml(); // 처음 빈 div 설정
    setDefaultLogoImg(); // default 로고 이미지 세팅
    resetDate(); // 날짜 데이터 초기화
    formType = $('input[name="formType"]:checked').val(); // 초기 타입 설정
    logUrl = $('input[name="logoType"]:checked').val(); // 초기 로고 타입 설정
    themaUrl = $('input[name="themeType"]:checked').val(); // 테마 타입 설정
})

$(window).load(() => {
    $('input[name="formType"]').change(function () { formType = $(this).val(); }); // 폼형태
    $('input[name="logoType"]').change(function()  { logUrl = $(this).val(); }); // 로고
    $('input[name="themeType"]').change(function() { themaUrl = $(this).val(); }); // 테마
    $('#startDate, #endDate').change(function () { watchingDate() }); // 날짜 유효성 검사
    $('input[type="checkbox"]').on('click', function() { validateCheckBox() }); // 이성이 등록
    $('input[type="text"]').on('input', function() { validateText() }); // 이성이 등록
    document.addEventListener('click', function(event) { validateMultipleChoiceSetting(event) }); // 이성이 등록
    document.addEventListener('input', function(event) { validateMultipleChoiceEmpty(event) }); // 이성이 등록
})