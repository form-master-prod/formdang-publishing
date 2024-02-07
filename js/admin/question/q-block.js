/**
 * 질문 블록 js
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
            .concat(`<button type="button" class="bt-add" onclick="addAnswer(event)">`)
            .concat(`<span class="skip">추가</span></button></li>`)
            .concat(`</ol>`)
            .concat(`</div>`)
            .concat(img_html(id)) // 이미지 등록 html 함수화
            .concat(`<div class="bottom-sheets">`)
            .concat(`<button type="button" class="bt-delete" title="삭제" onclick="deleteQuestion(event)"><span class="skip">삭제</span></button>`)
            .concat(`</div>`)
            .concat(`</div>`)
    return html;
}

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
            .concat(`<button type="button" class="bt-delete" title="삭제" onclick="deleteQuestion(event)"><span class="skip">삭제</span></button>`)
            .concat(`</div>`)
            .concat(`</div>`)
    return html;
}

function multiple_html() {
    const id = Date.now();
    let html = ''
    html =
        html.concat(`<div class="frm-area multiple-choice form-div q-3">`)
            .concat(`<div class="inp-group"><i class="number"></i>`)
            .concat(`<label class="skip">질문 제목</label><input type="text" name="" class="sub_subject" placeholder="질문 제목을 입력해주세요.">`)
            .concat(`<ol class="subject-valid">`);
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
    html =
        html.concat(`</ol>`)
            .concat(`</div>`)
            .concat(img_html(id)) // 이미지 등록 html 함수화
            .concat(`<div class="bottom-sheets">`)
            .concat(`<button type="button" class="bt-delete" title="삭제" onclick="deleteQuestion(event)"><span class="skip">삭제</span></button>`)
            .concat(`</div>`)
            .concat(`</div>`)
    return html;
}

function look_html() {
    const id = Date.now();
    let html = ''
    html =
        html.concat(`<div class="frm-area multiple-choice form-div q-4">`)
            .concat(`<div class="inp-group"><i class="number"></i>`)
            .concat(`<label class="skip">질문 제목</label><input type="text" name="" class="sub_subject" placeholder="질문 제목을 입력해주세요.">`)

    html =
        html.concat(`<div class="que-viewitem">`)
            .concat(`<p>보기</p>`)
            .concat(`<ol>`)

    for (let i=1; i <=5 ; i++) {
        const id = 'e' + i;
        html =
            html.concat(`<li>`)
                .concat(`<label for="">${que_arr[i]}</label>`)
                .concat(`<input type="text" class="${id}" name="${id}" placeholder="보기 내용을 입력하세요.">`)
                .concat(`</li>`)
    }

    html =
        html.concat(`</ol>`)
            .concat(`</div>`)

    html =
        html.concat(`<ol class="subject-valid">`);
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

    html =
        html.concat(`</ol>`)
            .concat(`</div>`)
            .concat(img_html(id)) // 이미지 등록 html 함수화
            .concat(`<div class="bottom-sheets">`)
            .concat(`<button type="button" class="bt-delete" title="삭제" onclick="deleteQuestion(event)"><span class="skip">삭제</span></button>`)
            .concat(`</div>`)
            .concat(`</div>`)
    return html;
}

function emptyHtml() {
    let html = ''
    html =
        html.concat(`<div class="not-result" id="not-result">`)
            .concat(`<i class="ico"></i><p>앗 ! 등록된 질문이 없어요.<br>버튼을 클릭하여 질문을 등록해주세요.</p>`)
            .concat(`<ul>`)
            .concat(`<li><a onclick="appendQuestion(short_html())" class="st-ico"><i class="ico i-short-answer"></i> <span>단답형 문항</span></a></li>`)
            .concat(`<li><a onclick="appendQuestion(subject_html())" class="st-ico"><i class="ico i-short-answer"></i> <span>서술형 문항</span></a></li>`)
            .concat(`<li><a onclick="appendQuestion(multiple_html())" class="st-ico"><i class="ico i-multiple"></i> <span>객관식 문항</span></a></li>`)
            .concat(`<li><a onclick="appendQuestion(look_html())" class="st-ico"><i class="ico i-view-que"></i> <span>보기 문항</span></a></li>`)
            .concat(`</ul>`)
            .concat(`</div>`)
    return html;
}

function appendQuestion (html) { // 문한 컨텐츠 추가
    if (getTotalQuestionCnt() >= 20) {
        modal_type = 'C';
        open_popup("질문 설정", "최대 등록(20개) 가능한 질문을 초과하였습니다.", "flex", '닫기', false) // 팝업 오픈
        return
    }
    removeEmptyHtml(); // empty html 제거
    $("#first_content").append(html); // 문항 html append
    updateNumbering() // 넘버링 업데이트
    updateQuestionCnt() // 문항 집계수 변경
}

function deleteQuestion (event) { // 문항 컨텐츠 삭제
    $(event.target).closest('.frm-area').remove(); // 삭제
    appendEmptyHtml(); // empty html 처리
    updateQuestionCnt() // 문항 집계수 변경
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

function updateQuestionCnt() { // 문항 수 집계 카운트 변경
    const arr = document.querySelectorAll('.q-cnt')
    arr[0].textContent = new String(document.querySelectorAll('.q-1').length);
    arr[1].textContent = new String(document.querySelectorAll('.q-2').length);
    arr[2].textContent = new String(document.querySelectorAll('.q-3').length);
    arr[3].textContent = new String(document.querySelectorAll('.q-4').length);
}

function getTotalQuestionCnt() {
    const arr = document.querySelectorAll('.q-cnt')
    let cnt = 0;
    cnt += document.querySelectorAll('.q-1') ? document.querySelectorAll('.q-1').length : 0;
    cnt += document.querySelectorAll('.q-2') ? document.querySelectorAll('.q-2').length : 0;
    cnt += document.querySelectorAll('.q-3') ? document.querySelectorAll('.q-3').length : 0;
    cnt += document.querySelectorAll('.q-4') ? document.querySelectorAll('.q-4').length : 0;
    return cnt;
}

function addAnswer(event) {
    const answerMaxCount = 4;
    const answerHtml = $(event.target).closest('#answer_wrap')[0];
    if( answerHtml.querySelectorAll('.add_item' ).length > answerMaxCount ){
        modal_type = 'C';
        open_popup("답안 설정", `최대 ${answerMaxCount + 1}개까지 생성 가능합니다.`, "flex", '닫기', false) // 팝업 오픈
        return false;
    }

    let html = ''
    html = html.concat(`<li class="add_item"><label class="skip"></label>`)
        .concat(`<input type="text" name="answer" placeholder="해당 주관식의 정답을 입력해주세요.">`)
        .concat(`<button type="button" class="bt-remove" onclick="removeAnswer(event)">`)
        .concat(`<span class="skip">삭제</span></button></li>`)
    $(answerHtml).append(html)
}

function removeAnswer(event){
    $(event.target).closest('.add_item').remove()
}