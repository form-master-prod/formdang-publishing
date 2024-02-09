let status, doubleSubmitPrevent = false; // 시작일, 종료일, 상태, 더블 체크 방지 처리
const checkbox_id_arr = ['q1', 'q2', 'q3', 'q4', 'q5'];
const look_id_arr = ['e1', 'e2', 'e3', 'e4', 'e5'];

/**
 * 폼 등록하기 함수
 * 이미지등록 -> 폼등록 순서로 async 처리
 * ToDo 이미지 대량 등록 처리
 * @returns {Promise<void>}
 */
async function enroll_form () { // 폼 등록하기
    const request = generate_request_data(formatDateToyyyyMMdd(beginDt), formatDateToyyyyMMdd(endDt), status) // 파라미터 만들기
    if (validate_write_request(request)) { // validate 체크
        await upload_image(request) // 이미지 업로드
        await register(request) // 폼 업로드
    }
}

/**
 * 등록하기 요청 데이터 생성
 * @param beginDt
 * @param endDt
 * @param status
 * @returns {Form}
 */
function generate_request_data(beginDt, endDt, status) { // 데이터 세팅
    let questions = [];
    let title = document.getElementById("subject").value; // 타이틀
    let detail = document.getElementById("explain").value; // 폼 설명
    let maxRespondent = document.getElementById("num-answer-sel").value; // 최대 답변 인원
    let formType = get_elements_val(document.getElementsByName('formType')); // 폼 타입 가져오기
    let themeType = get_elements_val(document.getElementsByName('themeType')); // 테마 타입 가져오기
    let logo = get_file_or_url_logo(); // 로고 정보 가져오기
    document.querySelectorAll('.inner#first_content .form-div').forEach((question, idx) => { questions.push(extract_question_data(question, idx)); }); // 질문 리스트 추출
    return new Form(formType, title, detail, beginDt, endDt, logo, themeType, questions, status, maxRespondent);
}

/**
 * 원소 리스트 중 체크 값 가져오기
 * @param elements
 * @returns {*}
 */
function get_elements_val(elements) {
    for (let e of elements) { if (e.checked) return  e.value; } // 데이터 가져오기
}

/**
 * 질문 값 추출
 * @param question
 * @param order
 * @returns {Question}
 */
function extract_question_data (question, order) { // 질문 리스트 데이터 추출
    let file = get_question_file(question);
    if (question.classList.contains('q-1')) { // 단답형 처리
        return get_short_question(order, question, file)
    } else if (question.classList.contains('q-2')) { // 서술형 처리
        return get_subject_question(order, question, file);
    } else if (question.classList.contains('q-3')) { // 객관식 처리
        return get_multiple_question(order, question, file);
    } else if (question.classList.contains('q-4')) { // 보기 문항 처리
        return get_look_question(order, question, file);
    }
};

/**
 * 단답형 문항 요청 값 생성
 * @param order
 * @param question
 * @param file
 * @returns {Question}
 */
function get_short_question(order, question, file) {
    const title = question.querySelector('.sub_subject').value;
    const placeholder = question.querySelector('.sub_explain').value;
    const answer = []; // 답 리스트
    question.querySelectorAll(`input[name="answer"]`).forEach(e=> {
        if (e && e.value) answer.push(e.value)
    }) // 단답형 답
    return new Question(0, 1, order, title, placeholder, null, null, answer, file);
}

/**
 * 서술형 문항 요청 값 생성
 * @param order
 * @param question
 * @param file
 */
function get_subject_question(order, question, file) {
    const title = question.querySelector('.sub_subject').value;
    return new Question(1, 1, order, title, null, null, null, null, file);
}

/**
 * 객관식 문항 요청 값 생성
 * @param order
 * @param question
 * @param file
 * @returns {Question}
 */
function get_multiple_question(order, question, file) {
    const title = question.querySelector('.sub_subject').value;
    let details = [], answer = [],count = 0 ; // 질문 리스트, 답 리스트, 질문 개수
    checkbox_id_arr.forEach(e => {
        const checkbox = question.querySelector(`input[name="each"][value="${checkbox_id_arr.indexOf(e) + 1}"]`); // 체크박스 답
        const detail = question.querySelector(`.${e}`).value; // 입력 질문
        if (detail) {
            details.push(detail);
            answer.push(checkbox.checked);
            count++;
        }
    })
    return new Question(2, count, order, title, null, details, null, answer, file);
}

/**
 * 보기 문항 요청 값 생성
 * @param order
 * @param question
 * @param file
 * @returns {Question}
 */
function get_look_question(order, question, file) {
    const title = question.querySelector('.sub_subject').value;
    let details = [], answer = [], examples = [],count = 0 ; // 질문 리스트, 답 리스트, 보기 문항 리스트, 질문 개수
    checkbox_id_arr.forEach(e => {
        const checkbox = question.querySelector(`input[name="each"][value="${checkbox_id_arr.indexOf(e) + 1}"]`); // 체크박스 답
        const detail = question.querySelector(`.${e}`).value; // 입력 질문
        if (detail) {
            details.push(detail);
            answer.push(checkbox.checked);
            count++;
        }
    })
    look_id_arr.forEach(e => {
        const detail = question.querySelector(`.${e}`).value; // 입력 질문
        if (detail) examples.push(detail);
    })
    return new Question(3, count, order, title, null, details, examples, answer, file);
}



/**
 * 질문 파일 등록
 * @param question
 * @returns {*|string|string|File|null}
 */
function get_question_file(question) {
    const files = question.querySelector('input[type=file]').files
    if (files && files.length > 0) { // 파일이 있는 경우 파일처리
        return files[0];
    } else { // 파일이 없는 경우
        const src = $(question.querySelector('.i-1'))[0].src;
        if (src.includes('gallery-remove.svg')) { // 파일 없음
            return null;
        } else {
            return src
        }
    }
}

/**
 * 폼 등록하기
 * 성공: 메인페이지 redirect
 * 실패: ToDo 실패 시 처리 추가
 * @param data
 * @returns {Promise<void>}
 */
async function register(data) { // 폼 등록
    await register_form_api(data).then(res => {
        if (res && res.resultCode == '0') {
            open_popup("등록 성공", "등록에 성공했습니다. 메인 페이지로 이동합니다.", "none", '확인', false, 'S') // 팝업 오픈
        } else {
            open_popup("등록 실패", "폼 등록에 실패하였습니다.", "flex", '닫기', false, 'C') // 팝업 오픈
        }
    })
    .catch(e => {
        open_popup("등록 실패", "폼 등록에 실패하였습니다.", "flex", '닫기', false, 'C') // 팝업 오픈
    })
}

/**
 * 등록 하기 모달 처리
 */
function enrollPopup() {
    status = 1
    open_popup('등록 하기', '폼을  등록하시겠습니까?', 'none', '예', true, 'R') // 팝업 오픈
}

/**
 * 임시 저장 모달 처리
 */
function tempPopup() {
    status = 0
    open_popup('임시 저장', '작성한 폼을 임시 저장 하시겠습니까?', 'flex', '예', true, 'R') // 팝업 오픈
}

/**
 * 모달 창 확인 버튼 처리
 */
function ok_popup() {
    if (modal_type == 'R') { // 폼 등록 버튼
        if (doubleSubmitPrevent) return // 중복 클릭 방지
        doubleSubmitPrevent = true;
        enroll_form().then(() => { doubleSubmitPrevent = false; }) // 등록
    } else if (modal_type == 'S') { // 폼 등록 완료 버튼
        window.location.replace(PAGE.ADMIN_MAIN)
    } else if (modal_type == 'C') { // 모달 닫기 버튼
        close_popup();
    }
}

/**
 * 모달 닫기 처리
 */
function close_popup() { // 팝업 닫기
    document.getElementById('modal_layer').style.display = "none";
    document.body.style.overflow = "auto";
}

/**
 * 퍼블리셔 추가 영역
 */
function purple_script() { // 퍼블 추가 내역
    $('.layer-sel').niceSelect(); // 체크박스
    document.querySelector('.bt-top').addEventListener('click', function(e){ // top 버튼
        e.preventDefault();
        window.scrollTo({top: 0, behavior: 'smooth'});
    });
}

$(document).ready(() => { // 초기 설정
    essentialLogin(); // 로그인 여부 검사
    append_empty_html(); // 처음 빈 div 설정
    set_default_log(); // default 로고 이미지 세팅
    purple_script(); // 퍼블리셔 스크립트
})

$(window).load(() => {

})