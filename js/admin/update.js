let doubleSubmitPrevent = false, status, fid;
const checkbox_id_arr = ['q1', 'q2', 'q3', 'q4', 'q5'];
const look_id_arr = ['e1', 'e2', 'e3', 'e4', 'e5'];
/**
 * 등록 하기 모달 처리
 */
function startPopup() {
    status = 1
    open_popup('설문 시작', '설문을 시작 하시겠습니까?', 'none', '예', true, 'R') // 팝업 오픈
}

/**
 * 임시 저장 모달 처리
 */
function updatePopup() {
    status = 0
    open_popup('수정 하기', '폼을 수정 하시겠습니까?', 'none', '예', true, 'R') // 팝업 오픈
}

/**
 * 모달 창 확인 버튼 처리
 */
function ok_popup() {
    if (modal_type == 'R') { // 폼 등록 버튼
        if (doubleSubmitPrevent) return // 중복 클릭 방지
        doubleSubmitPrevent = true;
        update_form().then(() => doubleSubmitPrevent = false);
    } else if (modal_type == 'S') { // 폼 등록 완료 버튼
        window.location.replace(PAGE.ADMIN_MAIN)
    } else if (modal_type == 'C') { // 모달 닫기 버튼
        close_popup();
    } else if (modal_type == 'CB') { // 모달 닫기 redirect
        redirect_close_popup();
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
 * 모달 닫기 처리 (redirect)
 */
function redirect_close_popup() { // 팝업 닫기
    document.getElementById('modal_layer').style.display = "none";
    document.body.style.overflow = "auto";
    window.location.replace(PAGE.ADMIN_MAIN);
}

/**
 * 폼 수정하기
 * @returns {Promise<void>}
 */
async function update_form() {
    const request = generate_request_data(formatDateToyyyyMMdd(beginDt), formatDateToyyyyMMdd(endDt), status) // 파라미터 만들기
    if (validate_write_request(request)) {
        await upload_image(request) // 이미지 업로드
        await update(request, fid)
    }
}

/**
 * 폼 수정하기
 * 성공: 메인페이지 redirect
 * @param data
 * @returns {Promise<void>}
 */
async function update(data, fid) { // 폼 등록
    await update_form_api(data, fid).then(res => {
        if (res && res.resultCode == '0') {
            open_popup("수정 성공", "수정에 성공했습니다. 메인 페이지로 이동합니다.", "none", '확인', false, 'S') // 팝업 오픈
        } else if (res && res.resultCode == REFUSE_ALREADY_START_FORM) {
            open_popup("수정 실패", "이미 시작된 폼은 수정 불가합니다.", "flex", '닫기', false, 'CB') // 팝업 오픈
        } else {
            open_popup("수정 실패", "폼 수정에 실패하였습니다.", "flex", '닫기', false, 'C') // 팝업 오픈
        }
    })
        .catch(e => {
            open_popup("수정 실패", "폼 수정에 실패하였습니다.", "flex", '닫기', false, 'C') // 팝업 오픈
        })
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
 * 폼 내용 불러오기
 * @param fid
 */
function find_form (fid) { // 설문 리스트 조회 함수
    find_form_api(fid).then(res => {
        if (res && res.resultCode == '0') {
            set_form_data(res)
        } else {
            open_popup("폼 조회 실패", "폼 내용을 불러오는데 실패하였습니다.", "flex", '닫기', false, 'CB') // 팝업 오픈
        }
    })
    .catch(e => {
        open_popup("폼 조회 실패", "폼 내용을 불러오는데 실패하였습니다.", "flex", '닫기', false, 'CB') // 팝업 오픈
    })
}

/**
 * 폼 데이터 세팅 처리
 * @param data
 */
function set_form_data(data) { // 데이터 세팅
    set_type_data(document.getElementsByName('formType'), data.type); // 폼타입 설정
    set_type_data(document.getElementsByName('themeType'), data?.themeUrl || ''); // 테마 설정
    set_max_respondent(data.maxRespondent); // 답변 인원 설정
    set_header_data(data.title, data.detail, data.beginDt, data.endDt); // 헤더 데이터 설정
    set_logo_url_to_img(data?.logoUrl || ri); // 로고 설정
    set_question(data.question.sort((a, b) => a.order - b.order)); // 질문 리스트 붙이기
    set_update_btn(data.status);
}

/**
 * 데이터 타입 세팅
 * @param types
 * @param val
 */
function set_type_data(types, val) {
    for (let i=0; i < types.length; i++) {
        if (types[i].value == val) types[i].checked = true
        else types[i].checked = false
    }
}

/**
 * 응답자 수 세팅
 * @param cnt
 */
function set_max_respondent(cnt) {  // 답변 인원 설정
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

/**
 * 헤더 데이터 세팅
 * @param title
 * @param detail
 * @param beginDt
 * @param endDt
 */
function set_header_data(title, detail, beginDt, endDt) { // 헤더 설정
    document.getElementById("subject").value = title
    document.getElementById("explain").value = detail
    document.getElementById("startDate").value = beginDt
    document.getElementById("endDate").value = endDt
}

/**
 * 질문 리스트 세팅
 * @param questions
 */
function set_question(questions) { // 질문 등록
    append_question_forms(questions); // 질문 폼 html append
    set_question_data(questions); // 질문 폼 html 데이터 세팅
}

/**
 * 폼 수정하기 버튼 able / dis able 검사 처리
 * @param status
 */
function set_update_btn(status) {
    if (status == 1) {
        document.querySelectorAll('.bt-wrap').forEach(e => {
            e.style.display = 'none'
        })
        document.querySelectorAll('.disabled-item').forEach(e => {
            e.disabled = true
        })
        document.querySelectorAll('.readOnly-item').forEach(e => {
            e.readOnly = true
        })
        $(document).off('.nice_select');
    }
}

/**
 * 질문 리스트 html append
 * @param questions
 */
function append_question_forms(questions) {
    const short = 0, subject = 1, multiple = 2, look = 3; // 단답형, 서술형, 객관식, 보기문항
    for (let i=0 ; i <questions.length; i++) {
        const e = questions[i];
        if (e.type == short) append_question(short_html())
        else if (e.type == subject) append_question(subject_html())
        else if (e.type == multiple) append_question(multiple_html())
        else if (e.type == look) append_question(look_html())
    }
}

/**
 * 질문 리스트 데이터 세팅
 * @param questions
 */
function set_question_data(data) {
    const short = 0, subject = 1, multiple = 2, look = 3; // 단답형, 서술형, 객관식, 보기문항
    let forms = document.querySelectorAll('.inner#first_content .form-div');
    for (let i=0; i < forms.length; i++) {
        let form = forms[i];
        if (data[i].type == short) set_short(form, data[i])
        else if (data[i].type == subject) set_subject(form, data[i])
        else if (data[i].type == multiple) set_multiple(form, data[i])
        else if (data[i].type == look) set_look(form, data[i])
    }
}

/**
 * 단답형 데이터 세팅
 * @param question
 * @param data
 */
function set_short(form, data) { // 단답형 추가
    form.querySelector('.sub_subject').value = data.title // 제목
    form.querySelector('.sub_explain').value = data?.placeholder || '' // placeholder
    for (let i = 0 ; i < data.answer.length - 1; i++) { // 첫번째 답 html은 생성되어있어 한개 최대 크기 - 1
        form.querySelector('.bt-add').click(); // 질문 답 추가
    }
    let answers = form.querySelectorAll('.add_item');
    for (let i=0; i < answers.length; i++) {
        answers[i].querySelector('input[name="answer"]').value = data.answer[i]; // 답 내용 세팅
    }
    set_question_url_to_img(form, data.imageUrl) // 이미지 세팅
}

/**
 * 서술형 데이터 세팅
 * @param question
 * @param data
 */
function set_subject(question, data) { // 서술형 추가
    question.querySelector('.sub_subject').value = data.title // 제목
    set_question_url_to_img(question, data.imageUrl) // 이미지 세팅
}

/**
 * 객관식 세팅
 * @param question
 * @param data
 */
function set_multiple(question, data) { // 객관식 추가
    question.querySelector('.sub_subject').value = data.title // 제목
    set_checkbox(question, data) // 객관식 정답 세팅
    set_question_url_to_img(question, data.imageUrl) // 이미지 세팅
}

/**
 * 보기 문항 세팅
 * @param question
 * @param data
 */
function set_look(question, data) { // 보기 문항 추가
    question.querySelector('.sub_subject').value = data.title
    set_checkbox(question, data)
    for (let i=0; i < 5; i++) { // 보기 처리
        const id = 'e' + (i+1);
        const text = question.querySelector(`input[name="${id}"]`); // 체크박스 답
        text.value = data?.exampleDetail[i] || '';
    }
    set_question_url_to_img(question, data.imageUrl) // 이미지 세팅
}

/**
 * 체크박스 데이터세팅 공통
 * @param question
 * @param data
 */
function set_checkbox(question, data) { // 공통 객관식 처리
    const checkbox = question.querySelectorAll(`input[name="each"]` ); // 체크박스
    for (let i=0; i < data.answer.length ; i++) {
        if (data.answer[i] == 'true') {
            checkbox[i].checked = true
        }
    }
    for (let i=0; i < 5; i++) {
        const id = 'q' + (i+1);
        const text = question.querySelector(`input[name="${id}"]`); // 체크박스 답
        text.value = data?.detail[i] || '';
    }
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
    purple_script(); // 퍼블 추가 내역
})

$(window).load(() => {
    const params = new URLSearchParams(window.location.search);
    fid = params.get('fid');
    find_form(fid)
})