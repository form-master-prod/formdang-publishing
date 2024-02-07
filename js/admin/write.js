let formType, themeUrl, beginDt, endDt, status
let doubleSubmitPrevent = false;
const today = new Date();
const today_7 = new Date(today);
today_7.setDate(today_7.getDate() + 7);

class Form {
    type; title; detail; beginDt; endDt; questionCount; status; maxRespondent; logoUrl; themeUrl; question;
    constructor(type, title, detail, beginDt, endDt, logUrl, themeUrl, question, status, maxRespondent) {
        this.type = type; this.title= title; this.detail = detail; this.beginDt = beginDt; this.endDt = endDt; this.logoUrl = logUrl; this.themeUrl = themeUrl; this.question = question;
        this.questionCount = question ? question.length : 0; this.maxRespondent = maxRespondent; this.status = status
    }
}

class Question {
    type; order; title; placeholder; imageUrl; detail; exampleDetail; count; answer; file;
    constructor(type, count, order, title, placeholder, detail, exampleDetail, answer, file) {
        this.type = type; this.count = count; this.order = order; this.title = title; this.placeholder = placeholder; this.detail = detail; this.exampleDetail = exampleDetail; this.answer = answer; this.file = file;
    }
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

function closeModal() { // 팝업 닫기
    let element = document.getElementById('modal_layer');
    element.style.display = "none";
    document.body.style.overflow = "auto";
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
    let title = document.getElementById("subject").value; // 타이틀
    let detail = document.getElementById("explain").value; // 폼 설명
    let maxRespondent = document.getElementById("num-answer-sel").value; // 최대 답변 인원
    let file = get_file_or_url_logo(); // 로고 정보 가져오기
    let arr = document.querySelectorAll('.inner#first_content .form-div');
    arr.forEach((question, idx) => { questions.push(extractData(question, idx)); }); // 질문 리스트 추출
    return new Form(formType, title, detail, formatDateToyyyyMMdd(beginDt), formatDateToyyyyMMdd(endDt), file, themeUrl, questions, s, maxRespondent);
}

function extractData (question, idx) { // 질문 리스트 데이터 추출
    let file;
    question.querySelectorAll('.file-input').forEach((e => { file = e.files[0]; }));
    if (question.classList.contains('q-1')) { // 단답형 처리
        const answer = []; // 답 리스트
        const shortAnswers = question.querySelectorAll(`input[name="answer"]`); // 단답형 답
        console.log(shortAnswers)
        shortAnswers.forEach(e=> {
            if (e && e.value) {
                answer.push(e.value)
            }
        })
        return new Question(0, 1, idx, question.querySelector('.sub_subject').value, question.querySelector('.sub_explain').value, null, null, answer, file);
    } else if (question.classList.contains('q-2')) { // 서술형 처리
        return new Question(1, 1, idx, question.querySelector('.sub_subject').value, null, null, null, null, file);
    } else if (question.classList.contains('q-3')) { // 객관식 처리
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
        return new Question(2, count, idx, question.querySelector('.sub_subject').value, null, details, null, answer, file);
    } else if (question.classList.contains('q-4')) { // 보기 문항 처리
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
        const arr2 = ['e1', 'e2', 'e3', 'e4', 'e5']; // 인자 class 리스트
        const examples = []; // 답 리스트
        arr2.forEach(e => {
            const detail = question.querySelector(`.${e}`).value; // 입력 질문
            if (detail) {
                examples.push(detail);
            }
        })
        return new Question(3, count, idx, question.querySelector('.sub_subject').value, null, details, examples, answer, file);
    }
};

function validateRequestData(request) { // 폼 설정 유효성 검사

    if (!request.beginDt || !request.endDt) { // 날짜 검사
        modal_type = 'C';
        open_popup("날짜 설정", "날짜를 입력해주세요.", "flex", '닫기', false) // 팝업 오픈
        return false;
    } else if (!request.title) { // 제목 검사
        modal_type = 'C';
        open_popup("폼 제목", "폼 제목을 작성해주세요.", "flex", '닫기', false) // 팝업 오픈
        return false;
    } else if (!request.detail) { // 폼 내용 검사
        modal_type = 'C';
        open_popup("폼 설명", "폼 설명을 작성해주세요.", "flex", '닫기', false) // 팝업 오픈
        return false;
    } else if (!request.question || request.question.length == 0) { //질문 입력 검사
        modal_type = 'C';
        open_popup("질문 설정", "질문을 입력해주세요.", "flex", '닫기', false) // 팝업 오픈
        return false;
    }

    for (let q of request.question) {
        if (q.type == 0) {
            if (!q.title) { // 단답형 제목 검사
                modal_type = 'C';
                open_popup("단답형 설정", "주관식 제목을 입력해주세요.", "flex", '닫기', false) // 팝업 오픈
                return false;
            } else if (!q.answer || q.answer.length == 0) {
                modal_type = 'C';
                open_popup("단답형 내용", "주관식 정답을 입력해주세요.", "flex", '닫기', false) // 팝업 오픈
                return false;
            }
        } else if (q.type == 1) {
            if (!q.title) { // 서술형 제목 검사
                modal_type = 'C';
                open_popup("서술형 설정", "주관식 제목을 입력해주세요.", "flex", '닫기', false) // 팝업 오픈
                return false;
            }
        } else if (q.type == 2) {
            if (!q.title) { // 객관식 제목 검사
                modal_type = 'C';
                open_popup("객관식 설정", "객관식 제목을 입력해주세요.", "flex", '닫기', false) // 팝업 오픈
                return false;
            } else if(!q.detail || q.detail.length == 0) { // 객관식 내용 검사
                modal_type = 'C';
                open_popup("객관식 내용", "객관식 내용을 입력해주세요.", "flex", '닫기', false) // 팝업 오픈
                return false;
            }
        } else if (q.type == 3) {
            if (!q.title) { // 객관식 제목 검사
                modal_type = 'C';
                open_popup("보기 설정", "객관식 제목을 입력해주세요.", "flex", '닫기', false) // 팝업 오픈
                return false;
            } else if(!q.detail || q.detail.length == 0) { // 객관식 내용 검사
                modal_type = 'C';
                open_popup("보기 내용", "객관식 내용을 입력해주세요.", "flex", '닫기', false) // 팝업 오픈
                return false;
            } else if(!q.exampleDetail || q.exampleDetail.length == 0) { // 객관식 내용 검사
                modal_type = 'C';
                open_popup("보기 내용", "보기 내용을 입력해주세요.", "flex", '닫기', false) // 팝업 오픈
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
        if (res && res.resultCode == '0') {
            modal_type = 'S';
            open_popup("등록 성공", "등록에 성공했습니다. 메인 페이지로 이동합니다.", "none", '확인', false) // 팝업 오픈
        } else {
            modal_type = 'C';
            open_popup("등록 실패", "폼 등록에 실패하였습니다.", "flex", '닫기', false) // 팝업 오픈
        }
    })
    .catch(e => {
        modal_type = 'C';
        open_popup("등록 실패", "폼 등록에 실패하였습니다.", "flex", '닫기', false) // 팝업 오픈
    })
}

function enrollPopup() {
    status = 1
    modal_type = 'R';
    open_popup('등록 하기', '폼을  등록하시겠습니까?', 'none', '예', true) // 팝업 오픈
}

function tempPopup() {
    status = 0
    modal_type = 'R';
    open_popup('임시 저장', '작성한 폼을 임시 저장 하시겠습니까?', 'flex', '예', true) // 팝업 오픈
}

$(document).ready(() => { // 초기 설정
    essentialLogin(); // 로그인 여부 검사
    append_empty_html(); // 처음 빈 div 설정
    resetDate(); // 날짜 데이터 초기화
    formType = $('input[name="formType"]:checked').val(); // 초기 타입 설정
    if (document.getElementById('my_logo').checked) { // 초기 기본 로고가 체크 되어있는 경우
        document.getElementById("img-default-logo").src = DEFAULT_LOGO_URL; // default 로고 이미지 세팅
    }
    $('.layer-sel').niceSelect(); // 퍼블 추가 내역
    let top_button = document.querySelector('.bt-top');
    top_button.addEventListener('click', function(e){
        e.preventDefault();
        window.scrollTo({top: 0, behavior: 'smooth'});
    });
})

$(window).load(() => {
    $('input[name="formType"]').change(function () { formType = $(this).val(); }); // 폼형태
    $('input[name="themeType"]').change(function() { themeUrl = $(this).val(); }); // 테마
    $('#startDate, #endDate').change(function () { watchingDate() }); // 날짜 유효성 검사
    $('input[type="checkbox"]').on('click', function() { validateCheckBox() }); // 이성이 등록
    $('input[type="text"]').on('input', function() { validateText() }); // 이성이 등록
    document.addEventListener('click', function(event) { validateMultipleChoiceSetting(event) }); // 이성이 등록
    document.addEventListener('input', function(event) { validateMultipleChoiceEmpty(event) }); // 이성이 등록
})