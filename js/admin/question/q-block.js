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
    let html = '';
    html =
        html.concat(`<div class="frm-area short-answer form-div q-1">`)
                .concat(`<div class="inp-group"><i class="number"></i>`)
                    .concat(`<label class="skip">질문 제목</label><input type="text" maxlength="256" name="" class="sub_subject readOnly-item" placeholder="질문 제목을 입력해주세요.">`)
                    .concat(`<label class="skip">질문 내용</label><input type="text" maxlength="64" name="" class="sub_explain readOnly-item" placeholder="주관식 질문 창에 보일 문구를 입력해주세요.">`)
                    .concat(`<ol id="answer_wrap" class="frm-answer">`)
                        .concat(`<li class="add_item"><label for="answer" class="skip">질문 1의 정답</label><input type="text" maxlength="64" name="answer" id="answer" class="readOnly-item" placeholder="해당 주관식의 정답을 입력해주세요.">`)
                        .concat(`<button type="button" class="bt-add disabled-item"  onclick="add_answer(event, 4)">`)
                        .concat(`<span class="skip">추가</span></button></li>`)
                    .concat(`</ol>`)
                .concat(`</div>`)
                .concat(img_html()) // 이미지 등록 html
                .concat(`<div class="bottom-sheets">`)
                    .concat(`<button type="button" class="bt-delete disabled-item" title="삭제" onclick="delete_question(event)"><span class="skip">삭제</span></button>`)
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
    let html = '';
    html =
        html.concat(`<div class="frm-area short-answer form-div q-2">`)
                .concat(`<div class="inp-group"><i class="number"></i>`)
                    .concat(`<label class="skip">질문 제목</label><input type="text" maxlength="256" name="" class="sub_subject readOnly-item" placeholder="질문 제목을 입력해주세요.">`)
                    .concat(`</ol>`)
                .concat(`</div>`)
                .concat(img_html()) // 이미지 등록 html 함수화
                .concat(`<div class="bottom-sheets">`)
                .   concat(`<button type="button" class="bt-delete disabled-item" title="삭제" onclick="delete_question(event)"><span class="skip">삭제</span></button>`)
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
    let html = ''
    html =
        html.concat(`<div class="frm-area multiple-choice form-div q-3">`)
                .concat(`<div class="inp-group"><i class="number"></i>`)
                    .concat(`<label class="skip">질문 제목</label><input type="text" maxlength="256" name="" class="sub_subject readOnly-item" placeholder="질문 제목을 입력해주세요.">`)
                    .concat(`<ol class="subject-valid">`);
    html = html.concat(loop_checkbox())
    html =
                html.concat(`</ol>`)
                .concat(`</div>`)
                .concat(img_html()) // 이미지 등록 html 함수화
                .concat(`<div class="bottom-sheets">`)
                    .concat(`<button type="button" class="bt-delete disabled-item" title="삭제" onclick="delete_question(event)"><span class="skip">삭제</span></button>`)
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
                        .concat(`<input type="checkbox" name="each" value="${i}" class="disabled-item" onclick="validate_checkbox(event)"><label class="skip">객관식 ${i}</label>`)
                    .concat(`</span>`)
                    .concat(`<span class="inp" style="width: 100%">`)
                        .concat(`<label class="skip">객관식 ${i} 내용</label><input type="text" maxlength="64" class="${id} readOnly-item" name="${id}" placeholder="${i}. 객관식 내용을 입력하세요.">`)
                    .concat(`</span>`)
                .concat(`</li>`)
    }
    return html;
}

/**
 * 객관식 문항 체크 처리
 * @param event
 */
function validate_checkbox(event) {
    const li = $(event.target).closest('li');
    let checkbox = $(li).find('input[type="checkbox"]');
    let inputValue = $(li).find('input[type="text"]').val();

    if (inputValue === "") {
        checkbox.prop("checked", false);
        open_popup("답 설정", `내용을 입력 후 체크해주세요.`, "flex", '닫기', false, 'C') // 팝업 오픈
    }
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
    let html = ''
    html =
        html.concat(`<div class="frm-area multiple-choice form-div q-4">`)
                .concat(`<div class="inp-group"><i class="number"></i>`)
                    .concat(`<label class="skip">질문 제목</label><input type="text" maxlength="256" name="" class="sub_subject readOnly-item" placeholder="질문 제목을 입력해주세요.">`)
                     .concat(`<div class="que-viewitem">`)
                        .concat(`<p>보기</p>`)
                        .concat(`<ol>`)
                html = html.concat(loop_input());
                html =
                    html.concat(`</ol>`)
                    .concat(`</div>`)
                    .concat(`<ol class="subject-valid">`);
            html = html.concat(loop_checkbox2());
            html =
                html.concat(`</ol>`)
                .concat(`</div>`)
                .concat(img_html()) // 이미지 등록 html 함수화
                .concat(`<div class="bottom-sheets">`)
                    .concat(`<button type="button" class="bt-delete disabled-item" title="삭제" onclick="delete_question(event)"><span class="skip">삭제</span></button>`)
                .concat(`</div>`)
            .concat(`</div>`)

    return html;
}

/**
 * 체크 박스 loop html 처리
 * 보기문항 input 정규식 처리로 분리
 * @returns {string}
 */
function loop_checkbox2() {
    let html = '';
    for (let i=1; i <=5 ; i++) { // 1~5문항 loop 생성
        const id = 'q' + i;
        html =
            html.concat(`<li>`)
                .concat(`<span class="ctm-chk">`)
                .concat(`<input type="checkbox" name="each" value="${i}" class="disabled-item" onclick="validate_checkbox(event)"><label class="skip">객관식 ${i}</label>`)
                .concat(`</span>`)
                .concat(`<span class="inp" style="width: 100%">`)
                .concat(`<label class="skip">객관식 ${i} 내용</label><input type="text" maxlength="64" oninput="validateInput(event)" class="${id} readOnly-item" name="${id}" placeholder="${i}. 객관식 내용을 입력하세요.">`)
                .concat(`</span>`)
                .concat(`</li>`)
    }
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
                    .concat(`<input type="text" maxlength="100" class="${id} readOnly-item" name="${id}" placeholder="보기 내용을 입력하세요.">`)
                .concat(`</li>`)
    }
    return html;
}

function validateInput(event) {
    const allowedCharacters = /^[ㄱ-ㅁ,\s]+$/;
    const inputText = event.target.value;

    if (!allowedCharacters.test(inputText)) {
        // 허용되지 않는 문자가 입력되었을 때 처리할 내용
        event.target.value = inputText.replace(/[^ㄱ-ㅁ,\s]/g, ' ');
    }
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

function fail_paper(text) {
    let html = ''
    html =
        html.concat(`<div class="not-result" id="not-result">`)
            .concat(`<i class="ico"></i>${text}`)
            .concat(`<ul>`)
                .concat(`<li ><a onclick="move_home()" class="st-ico"><i class="ico i-key"></i> <span>나의 설문 만들기</span></a></li>`)
            .concat(`</ul>`)
            .concat(`</div>`)
    return html;
}

function move_home() {
    window.location.href = PAGE.WRITE
}

function move_login() {
    window.location.href = PAGE.LOGIN.PAPER_MY;
}

function move_back() {
    window.history.back();
}


/**
 * 질문 추가 html
 * 종류별 html 파라미터로 등록
 * 최대 20개 처리
 * @param html
 */
function append_question (html) { // 문한 컨텐츠 추가
    if (get_total_question_cnt() >= MAX_COUNT) {
        open_popup("질문 설정", "최대 등록(20개) 가능한 질문을 초과하였습니다.", "flex", '닫기', false, 'C') // 팝업 오픈
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
        open_popup("답안 설정", `최대 ${maxCnt + 1}개까지 생성 가능합니다.`, "flex", '닫기', false, 'C') // 팝업 오픈
    } else {
        let html = ''
        html =
            html.concat(`<li class="add_item"><label class="skip"></label>`)
                .concat(`<input type="text"  maxlength="64" name="answer" class="readOnly-item" placeholder="해당 주관식의 정답을 입력해주세요.">`)
                .concat(`<button type="button" class="bt-remove disabled-item" onclick="remove_answer(event)">`)
                .concat(`<span class="skip">삭제</span></button></li>`)
        $(answerHtml).append(html)
    }
}

/**
 * 단답형 정답 삭제 처리
 * @param event
 */
function remove_answer(event) { $(event.target).closest('.add_item').remove() }

/**
 * 유저 화면 서술형 append
 * @param d
 * @returns {string}
 */
function user_short_html(d) {
    let html = ''
    html = html.concat(`<div class="frm-area short-answer q-1">`)
        .concat(`<div class="inp-group">`)
        .concat(`<i class="number" data-question="${d.type}" data-qid="${d.qid}">${d.order + 1}</i>`)
        .concat(`<h4>${d.title}</h4>`);

    if (d.imageUrl) {
        html = html.concat(`<p class="img-view"><img src="${d.imageUrl}" alt=""></p>`)
    }

    html = html.concat(`<textarea name="" id="" cols="" rows="" placeholder="${d.placeholder ? d.placeholder : '해당 주관식의 정답을 입력해주세요.'}"></textarea>`)
        .concat(`</div>`)
        .concat(`</div>`)
    return html
}

/**
 * 유저 화면 단답형 append
 * @param d
 * @returns {string}
 */
function user_subject_html(d) {
    let html = ''
    html = html.concat(`<div class="frm-area short-answer q-1">`)
        .concat(`<div class="inp-group">`)
        .concat(`<i class="number" data-question="${d.type}" data-qid="${d.qid}">${d.order + 1}</i>`)
        .concat(`<h4>${d.title}</h4>`);

    if (d.imageUrl) {
        html = html.concat(`<p class="img-view"><img src="${d.imageUrl}" alt=""></p>`)
    }

    html = html.concat(`<textarea name="" id="" cols="" rows="" placeholder="해당 주관식의 정답을 입력해주세요."></textarea>`)
        .concat(`</div>`)
        .concat(`</div>`)
    return html
}

/**
 * 유저 화면 객관식 append
 * @param d
 * @returns {string}
 */
function user_multiple_html(d) {
    let html = ''
    html = html.concat(`<div class="frm-area multiple-choice">`)
        .concat(`<div class="inp-group">`)
        .concat(`<i class="number" data-question="${d.type}" data-qid="${d.qid}">${d.order + 1}</i>`)
        .concat(`<h4>${d.title}</h4>`);

    if (d.imageUrl) {
        html = html.concat(`<p class="img-view"><img src="${d.imageUrl}" alt=""></p>`)
    }

    html = html.concat(`<ol class="subject-valid">`)
        .concat(user_loop_checkbox(d.detail))
        .concat(`</ol>`)
        .concat(`</div>`)
        .concat(`</div>`)
    return html
}

/**
 * 유저 화면 보기 append
 * @param d
 * @returns {string}
 */
function user_look_html(d) {
    let html = ''
    html = html.concat(`<div class="frm-area multiple-choice">`)
        .concat(`<div class="inp-group">`)
        .concat(`<i class="number" data-question="${d.type}" data-qid="${d.qid}">${d.order + 1}</i>`)
        .concat(`<h4>${d.title}</h4>`);

    if (d.imageUrl) {
        html = html.concat(`<p class="img-view"><img src="${d.imageUrl}" alt=""></p>`)
    }

    html = html.concat(`<div class="que-viewitem">`)
        .concat(`<p>보기</p>`)
        .concat(`<ol>`)
        .concat(user_loop_input(d.exampleDetail))
        .concat(`</ol>`)
        .concat(`</div>`)
        .concat(`<ol class="subject-valid">`).
        concat(user_loop_checkbox(d.detail))
        .concat(`</ol>`)
        .concat(`</div>`)
        .concat(`</div>`)
    return html
}

/**
 * 유저화면 체크박스 loop append
 * @param detail
 * @returns {string}
 */
function user_loop_checkbox(detail) {
    let html = ''
    if (detail) {
        for (let i in detail) {
            html = html.concat(`<li>`)
                .concat(`<span class="ctm-chk">`)
                .concat(`<input type="checkbox" name="each" value="${Number(i) + 1}">`)
                .concat(`<label class="skip">객관식 ${Number(i) + 1}</label>`)
                .concat(`</span>`)
                .concat(`<span class="inp">${Number(i) + 1}. ${detail[i]}</span>`)
                .concat(`</li>`)
        }
    }
    return html;
}

/**
 * 유저 화면 보기문항 loop append
 * @param exampleDetail
 * @returns {string}
 */
function user_loop_input(exampleDetail) {
    let html = ''
    if (exampleDetail) {
        for (let i in exampleDetail) {
            html = html.concat(`<li>${que_arr[Number(i)+1]} ${exampleDetail[i]}</li>`)
        }
    }
    return html;
}

/**
 * 유저 화면 질문 block append
 * @param html
 */
function user_append_question (html) { // 문한 컨텐츠 추가
    $(".inner").append(html); // 문항 html append
}


/**
 * 페이지바 append html
 * @param curPage
 * @param totalPage
 */
function append_page_bar(curPage, totalPage) { // 페이징 바 붙이기
    let bar = parseInt(curPage / PAGE_BAR_NUM) // 페이지 바 번호
    let html = '';
    html = html.concat(`<a class="prev" onclick="move_prev()"><span class="skip">처음</span> <i class="ico"></i></a>`) // 왼쪽 화살표
    for (let i=0; i <5 ; i++) { // 페이지 붙이기
        let num = (bar * PAGE_BAR_NUM) + i + 1;
        if (num == curPage + 1) {
            html = html.concat(`<a class="current"><strong>${num}</strong></a>`) // 현재 페이지
        } else if (num <= totalPage) {
            html = html.concat(`<a onclick="move_page(this)">${num}</a>`) // 페이지
        }
    }
    html = html.concat(`<a class="next" onclick="move_next()"><span class="skip">끝</span> <i class="ico"></i></a>`) // 오른쪽 화살표
    $('.pagenate .inner').append(html)
}

/**
 * 페이지 바 왼쪽 화살표
 */
function move_prev() { // 왼쪽 화살표 이동
    if (!isFirstPageBar(page, PAGE_BAR_NUM)) { // 처음 페이지 바 검사
        let bar = parseInt(page / PAGE_BAR_NUM) * PAGE_BAR_NUM - 1
        window.location.href = `${PAGE.ADMIN_MAIN}?${P_PAGE}=${bar}&${P_TYPE}=${type}&${P_STATUS}=${status}`
    }
}

/**
 * 페이지 바 오른쪽 화살표
 */
function move_next() { // 오른쪽 화살표 이동
    if (!isEndPageBar(page, totalPage, PAGE_BAR_NUM)) { // 마지막 페이지바 검사
        let bar = parseInt(page / PAGE_BAR_NUM) * PAGE_BAR_NUM + PAGE_BAR_NUM
        window.location.href = `${PAGE.ADMIN_MAIN}?${P_PAGE}=${bar}&${P_TYPE}=${type}&${P_STATUS}=${status}&${P_ORDER}=${order}`
    }
}

/**
 * 페이지 이동
 * @param e
 */
function move_page(e) { // 페이지 이동
    let page = parseInt($(e).text()) - 1
    window.location.href = `${PAGE.ADMIN_MAIN}?${P_PAGE}=${page}&${P_TYPE}=${type}&${P_STATUS}=${status}&${P_ORDER}=${order}`
}

/**
 * 메인 페이지 빈 html
 * @returns {string}
 */
function main_empty_html() { // 등록 폼이 없는경우 빈 html 처리
    let html = ''
    html =
        html.concat(`<div class="not-result">`)
            .concat(`<i class="ico"></i>`)
            .concat(`<p>앗 ! 등록된 폼이 없어요.<br>버튼을 클릭하여 폼을 만들어주세요.</p>`)
            .concat(`<a href="write.html" class="st-ico"><i class="ico i-form"></i> <span>폼 작성하기</span></a>`)
            .concat(`</div>`)
    return html;
}

/**
 * 메인 페이지 이미지 html
 * @param i
 * @returns {string}
 */
function main_img_html (i) { // 로고 이미지 HTML
    let html = '';
    if (i) html = html.concat(`<span><img src="${i}" alt=""></span>`) // 로고 이미지가 있는경우
    else html = html.concat(`<span class="not-img"><img src="../image/icon/gallery-remove.svg" alt=""></span>`) // 로고 이미지가 없는 경우
    return html;
}

/**
 * 메인 페이지 카드 html
 * @param url
 * @param ico
 * @param sub
 * @param logo
 * @param title
 * @param regDt
 * @param del
 * @returns {string}
 */
function card_html (url, ico, sub, logo, title, regDt, del) { // 설문 카드 HTML
    let html = '';
    html =
        html.concat(`<li class="${del}">`)
            .concat(`<a href="${url}">`)
            .concat(`<i class="ico ${ico}">`)
            .concat(`<span class="skip">${sub}</span></i>`)
            .concat(`<figure class="thumb">${logo}</figure>`)
            .concat(`<h3>${title}</h3>`)
            .concat(`<p>`)
            .concat(`<i class="ico"></i>${regDt}</p>`)
            .concat(`</a>`)
            .concat(`</li>`)
    return html;
}