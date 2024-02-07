/**
 * 질문 블록 js
 */


const que_arr = ['', 'ㄱ.', 'ㄴ.', 'ㄷ.', 'ㄹ.', 'ㅁ.']
const MAX_COUNT = 20;

/**
 * 단답형 질문 등록 (class q-1)
 * 
 * 이미지 html 호출 처리
 * @returns {string}
 */
function short_html() {
    const id = Date.now();
    let html = '';
    html =
        html.concat(`<div class="frm-area short-answer form-div q-1">`)
                .concat(`<div class="inp-group"><i class="number"></i>`)
                    .concat(`<label class="skip">질문 제목</label><input type="text" name="" class="sub_subject" placeholder="질문 제목을 입력해주세요.">`)
                    .concat(`<label class="skip">질문 내용</label><input type="text" name="" class="sub_explain" placeholder="주관식 질문 창에 보일 문구를 입력해주세요.">`)
                    .concat(`<ol id="answer_wrap" class="frm-answer">`)
                        .concat(`<li class="add_item"><label for="answer-${id}" class="skip">질문 1의 정답</label><input type="text" name="answer" id="answer-${id}" placeholder="해당 주관식의 정답을 입력해주세요.">`)
                        .concat(`<button type="button" class="bt-add" onclick="add_answer(event, 4)">`)
                        .concat(`<span class="skip">추가</span></button></li>`)
                    .concat(`</ol>`)
                .concat(`</div>`)
                .concat(img_html(id)) // 이미지 등록 html
                .concat(`<div class="bottom-sheets">`)
                    .concat(`<button type="button" class="bt-delete" title="삭제" onclick="delete_question(event)"><span class="skip">삭제</span></button>`)
                .concat(`</div>`)
            .concat(`</div>`)
    return html;
}

/**
 * 서술형 질문 등록 (class q-2)
 *
 * 이미지 html 처리
 * @returns {string}
 */
function subject_html() {
    const id = Date.now();
    let html = '';
    html =
        html.concat(`<div class="frm-area short-answer form-div q-2">`)
                .concat(`<div class="inp-group"><i class="number"></i>`)
                    .concat(`<label class="skip">질문 제목</label><input type="text" name="" class="sub_subject" placeholder="질문 제목을 입력해주세요.">`)
                    .concat(`</ol>`)
                .concat(`</div>`)
                .concat(img_html(id)) // 이미지 등록 html 함수화
                .concat(`<div class="bottom-sheets">`)
                .   concat(`<button type="button" class="bt-delete" title="삭제" onclick="delete_question(event)"><span class="skip">삭제</span></button>`)
                .concat(`</div>`)
            .concat(`</div>`)
    return html;
}

/**
 * 객관식 질문 등록 (class q-3)
 *
 * 이미지 html 처리
 * 체크 박스 loop html 처리
 * @returns {string}
 */
function multiple_html() {
    const id = Date.now();
    let html = ''
    html =
        html.concat(`<div class="frm-area multiple-choice form-div q-3">`)
                .concat(`<div class="inp-group"><i class="number"></i>`)
                    .concat(`<label class="skip">질문 제목</label><input type="text" name="" class="sub_subject" placeholder="질문 제목을 입력해주세요.">`)
                    .concat(`<ol class="subject-valid">`);
    html = html.concat(loop_checkbox())
    html =
                html.concat(`</ol>`)
                .concat(`</div>`)
                .concat(img_html(id)) // 이미지 등록 html 함수화
                .concat(`<div class="bottom-sheets">`)
                    .concat(`<button type="button" class="bt-delete" title="삭제" onclick="delete_question(event)"><span class="skip">삭제</span></button>`)
                .concat(`</div>`)
            .concat(`</div>`)
    return html;
}

/**
 * 체크 박스 loop html 처리
 * @returns {string}
 */
function loop_checkbox() {
    let html = '';
    for (let i=1; i <=5 ; i++) { // 1~5문항 loop 생성
        const id = 'q' + i;
        html =
            html.concat(`<li>`)
                    .concat(`<span class="ctm-chk">`)
                        .concat(`<input type="checkbox" name="each" value="${i}"><label class="skip">객관식 ${i}</label>`)
                    .concat(`</span>`)
                    .concat(`<span class="inp" style="width: 100%">`)
                        .concat(`<label class="skip">객관식 ${i} 내용</label><input type="text" class="${id}" name="${id}" placeholder="${i}. 객관식 내용을 입력하세요.">`)
                    .concat(`</span>`)
                .concat(`</li>`)
    }
    return html;
}

/**
 * 보기 질문 등록 (class q-4)
 *
 * 이미지 html 처리
 * 체크 박스 loop html 처리
 * 보기 문항 loop html 처리
 * @returns {string}
 */
function look_html() {
    const id = Date.now();
    let html = ''
    html =
        html.concat(`<div class="frm-area multiple-choice form-div q-4">`)
                .concat(`<div class="inp-group"><i class="number"></i>`)
                    .concat(`<label class="skip">질문 제목</label><input type="text" name="" class="sub_subject" placeholder="질문 제목을 입력해주세요.">`)
                     .concat(`<div class="que-viewitem">`)
                        .concat(`<p>보기</p>`)
                        .concat(`<ol>`)
                html = html.concat(loop_input());
                html =
                    html.concat(`</ol>`)
                    .concat(`</div>`)
                    .concat(`<ol class="subject-valid">`);
            html = html.concat(loop_checkbox());
            html =
                html.concat(`</ol>`)
                .concat(`</div>`)
                .concat(img_html(id)) // 이미지 등록 html 함수화
                .concat(`<div class="bottom-sheets">`)
                    .concat(`<button type="button" class="bt-delete" title="삭제" onclick="delete_question(event)"><span class="skip">삭제</span></button>`)
                .concat(`</div>`)
            .concat(`</div>`)

    return html;
}

/**
 * 보기 문항 loop html 처리
 * @returns {string}
 */
function loop_input() {
    let html = ''
    for (let i=1; i <=5 ; i++) {
        const id = 'e' + i;
        html =
            html.concat(`<li>`)
                    .concat(`<label for="">${que_arr[i]}</label>`)
                    .concat(`<input type="text" class="${id}" name="${id}" placeholder="보기 내용을 입력하세요.">`)
                .concat(`</li>`)
    }
    return html;
}

/**
 * 데이터 빈값 html
 * @returns {string}
 */
function empty_html() {
    let html = ''
    html =
        html.concat(`<div class="not-result" id="not-result">`)
                .concat(`<i class="ico"></i><p>앗 ! 등록된 질문이 없어요.<br>버튼을 클릭하여 질문을 등록해주세요.</p>`)
                .concat(`<ul>`)
                    .concat(`<li><a onclick="append_question(short_html())" class="st-ico"><i class="ico i-short-answer"></i> <span>단답형 문항</span></a></li>`)
                    .concat(`<li><a onclick="append_question(subject_html())" class="st-ico"><i class="ico i-short-answer"></i> <span>서술형 문항</span></a></li>`)
                    .concat(`<li><a onclick="append_question(multiple_html())" class="st-ico"><i class="ico i-multiple"></i> <span>객관식 문항</span></a></li>`)
                    .concat(`<li><a onclick="append_question(look_html())" class="st-ico"><i class="ico i-view-que"></i> <span>보기 문항</span></a></li>`)
                .concat(`</ul>`)
            .concat(`</div>`)
    return html;
}

/**
 * 질문 추가 html
 * 종류별 html 파라미터로 등록
 * 최대 20개 처리
 * @param html
 */
function append_question (html) { // 문한 컨텐츠 추가
    if (get_total_question_cnt() >= MAX_COUNT) {
        modal_type = 'C';
        open_popup("질문 설정", "최대 등록(20개) 가능한 질문을 초과하였습니다.", "flex", '닫기', false) // 팝업 오픈
    } else {
        remove_empty_html(); // empty html 제거
        $("#first_content").append(html); // 문항 html append
        update_numbering() // 넘버링 업데이트
        update_question_cnt() // 문항 집계수 변경
    }

}

/**
 * 질문 삭제 처리
 * @param event
 */
function delete_question (event) { // 문항 컨텐츠 삭제
    $(event.target).closest('.frm-area').remove(); // 삭제
    append_empty_html(); // empty html 처리
    update_question_cnt() // 문항 집계수 변경
}

/**
 * 질문 수 카운팅 후 미존재시 empty html 처리
 */
function append_empty_html() { // empty html 처리
    let formDivElements = document.querySelectorAll('.form-div'); // 문항 class
    if (formDivElements.length < 1) $("#first_content").prepend(empty_html()); // 문항이 없는 경우 empty html append 처리
    else update_numbering(); // 넘버링 업데이트
}

/**
 * 질문이 생성시 empty html 삭제
 */
function remove_empty_html () { // empty 문항 제거
    let notResultElement = document.getElementById("not-result");
    if (notResultElement) notResultElement.parentNode.removeChild(notResultElement); // empty html 있는 경우 삭제
}

/**
 * 문항 넘버링 처리
 */
function update_numbering () { // 문항 넘버링
    let questions = document.querySelectorAll('.inner#first_content .form-div');
    questions.forEach(function (e, i) {
        e.querySelector('.number').textContent = i + 1;
    });
};

/**
 * 문항 집계수 처리
 */
function update_question_cnt() { // 문항 수 집계 카운트 변경
    const arr = document.querySelectorAll('.q-cnt')
    arr[0].textContent = new String(document.querySelectorAll('.q-1').length);
    arr[1].textContent = new String(document.querySelectorAll('.q-2').length);
    arr[2].textContent = new String(document.querySelectorAll('.q-3').length);
    arr[3].textContent = new String(document.querySelectorAll('.q-4').length);
}

/**
 * 문항 총 개수 처리
 * @returns {number}
 */
function get_total_question_cnt() {
    let cnt = 0;
    cnt += document.querySelectorAll('.q-1') ? document.querySelectorAll('.q-1').length : 0;
    cnt += document.querySelectorAll('.q-2') ? document.querySelectorAll('.q-2').length : 0;
    cnt += document.querySelectorAll('.q-3') ? document.querySelectorAll('.q-3').length : 0;
    cnt += document.querySelectorAll('.q-4') ? document.querySelectorAll('.q-4').length : 0;
    return cnt;
}

/**
 * 단답형 정답 등록 처리
 * @param event
 * @param maxCnt
 */
function add_answer(event, maxCnt) {
    const answerHtml = $(event.target).closest('#answer_wrap')[0];
    if( answerHtml.querySelectorAll('.add_item' ).length > maxCnt ){
        modal_type = 'C';
        open_popup("답안 설정", `최대 ${maxCnt + 1}개까지 생성 가능합니다.`, "flex", '닫기', false) // 팝업 오픈
    } else {
        let html = ''
        html =
            html.concat(`<li class="add_item"><label class="skip"></label>`)
                .concat(`<input type="text" name="answer" placeholder="해당 주관식의 정답을 입력해주세요.">`)
                .concat(`<button type="button" class="bt-remove" onclick="remove_answer(event)">`)
                .concat(`<span class="skip">삭제</span></button></li>`)
        $(answerHtml).append(html)
    }
}

/**
 * 단답형 정답 삭제 처리
 * @param event
 */
function remove_answer(event) { $(event.target).closest('.add_item').remove() }
