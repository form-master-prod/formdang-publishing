/**
 * 이미지 js
 *
 */

const DEFAULT_LOG_IMG = 'img-src-logo'
const DEFAULT_BLANK_IMG_NAME = 'gallery-remove.svg';
const DEFAULT_LOGO_URL = "https://formmaster-s3.s3.ap-northeast-2.amazonaws.com/logo/d5e6f7a8-9b10-c111-d2e3-4455f6778899.jpg"; // 로고 이미지 상수
const ri = '../image/icon/gallery-remove.svg'

/**
 * 이미지 HTML 처리
 * @returns {string}
 */
function img_html() {
    let html = ''
    html =
        html.concat(`<div class="frm-upload">`)
            .concat(`<canvas class="img-view" style="display: none"></canvas>`) // 이미지 등록
            .concat(`<div class="img-view">`)
            .concat(`<span class="not-img"><img src="../image/icon/gallery-remove.svg" alt="" class="i-1" ></span>`)
            .concat(`</div>`)
            .concat(`<label onclick="find_file(event)">이미지 등록하기</label>`)
            .concat(`<input type="file" name="img" class="file-input disabled-item" onchange="set_preview_img(event)">`)
            .concat(`</div>`)
    return html;
}

/**
 * 파일 등록 창 호출
 * @param event
 */
function find_file(event) {
    const root = $(event.target).closest('div');
    $(root).find('input[type=file]')[0].click() // 파일 등록 창 호출
}


/**
 * 이미지 미리보기 처리
 * @param id
 */
function set_preview_img(event) { // 이미지 미리보기 처리
    const root = $(event.target).closest('div');
    const input = $(root).find('input[type=file]')[0];
    const canvas = $(root).find('canvas')[0];
    const div = $(root).find('div')[0]
    const context = canvas.getContext('2d');
    const file = input.files[0];
    $(root).find('img')[0].src = '' // 이미지 src 세팅 제거
    readFile(file, canvas, div, context) // 파일 읽기 후 미리보기 설정
}

/**
 * 파라미터 이미지 URL 로고 세팅 처리
 * @param logo
 */
function set_logo_url_to_img(logo) { // 로고 이미지 세팅
    document.getElementById(DEFAULT_LOG_IMG).src = logo
    if (!logo || logo == ri) { // 로고 없음
        document.getElementById('not_logo').checked = true;
    } else if (logo == DEFAULT_LOGO_URL) { // 기본 로고
        document.getElementById('my_logo').checked = true;
    } else { // 로고 등록
        document.getElementById('file_logo').checked = true;
        const canvas = document.getElementById(`img-canvas-logo`);
        const div = document.getElementById(`img-div-logo`)
        const context = canvas.getContext('2d');
        canvas.style.display = 'flex'; // 예시로 보여주는 방식, 실제로 사용하는 방식에 따라 다를 수 있음
        div.style.display = 'none';
        set_canvas_preview_img(context, canvas, logo);
    }
}

/**
 * 질문 이미지 URL 세팅 처리
 * @param question
 * @param src
 */
function set_question_url_to_img(question, src) {
    if (!src) return
    const canvas = question.querySelector('canvas');
    const div = question.querySelector('.frm-upload div')
    const context = canvas.getContext('2d');
    canvas.style.display = 'flex'; // 예시로 보여주는 방식, 실제로 사용하는 방식에 따라 다를 수 있음
    div.style.display = 'none';
    $(question.querySelector('.i-1'))[0].src = src
    set_canvas_preview_img(context, canvas,  src);
}

/**
 * 로고(상호) 변경하기 파일 등록 처리
 * 파일 등록 여부에 따라 로고 체크박스 체크를 위해 기능 확장
 */
function set_preview_main_logo_img(event) { // 로고 파일 등록
    const input = document.getElementById('img-logo');
    if (input.files.length > 0) {
        document.getElementById('file_logo').checked = true; // 로고 체크 박스 `등록` 선택 처리
        set_preview_img(event);
    }
}

/**
 * 로고 삭제
 * canvas 미리보기 로고 disable
 * div 로고 able 처리
 * logo value 삭제
 */
function delete_logo() { // 로고 파일 이미지 삭제
    const canvas = document.getElementById('img-canvas-logo');
    const div = document.getElementById('img-div-logo')
    let logo = document.getElementById("img-logo")
    canvas.style.display = "none";
    div.style.display = "flex";
    logo.value = null;
}

/**
 * type: 0 로고 없음
 * type: 1 기본 로고
 * type: 2 파일 등록
 *
 * 파일 등록시 파일 등록 선택을 하지 않을 수 있기에 이전 체크박스 상태 유지 처리
 * @param type
 */
function change_logo_img(type) {
    const logo = document.getElementById(DEFAULT_LOG_IMG);
    if (type == 0) { // 없음 선택
        logo.src = ri; // 로고 없음 이미지
        delete_logo() // 등록된 파일 로고 삭제
    } else if (type == 1) { // 기본 선택
        logo.src = DEFAULT_LOGO_URL; // 기본 폼당 이미지
        delete_logo() // 등록된 파일 로고 삭제
    } else if (type == 2) { // 파일 등록 선택
        if (logo.src.includes(DEFAULT_BLANK_IMG_NAME)) { // 로고 없음 체크박스 유지
            document.getElementById('not_logo').checked = true;
        } else if (logo.src.includes(DEFAULT_LOGO_URL)) { // 로고 기본 체크박스 유지
            document.getElementById('my_logo').checked = true;
        }
        console.log('??')
        document.getElementById('img-logo').click(); // 로고 파일 등록 호출
    }
}

/**
 * 내 로고 데이터 조회하기
 *
 * 로고 파일이 존재할 경우 파일 return
 *
 * 로고 파일이 존재하지 않을 경우 url return
 *
 * @returns {null|*}
 */
function get_file_or_url_logo() { // 내 로고 조회하기 ( 파일 or URL 가져오기)
    let logo = document.getElementById("img-logo"); // 로고 element
    if (logo.files && logo.files.length > 0) {
        return logo.files[0] // 등록 로고 파일 반환
    } else {
        const logoImg = document.getElementById(DEFAULT_LOG_IMG);
        if (!logoImg || logoImg.src.includes(DEFAULT_BLANK_IMG_NAME)) return null // 로고 null or 로고 없음은 로고 url 없음
        return logoImg.src // 로고 URL 반환
    }
}

/**
 * 로고 파일 변경시 파일 미리보기 설정 처리
 * div disable 처리, canvas able 처리
 * @param file
 * @param canvas
 * @param div
 * @param context
 */
function readFile(file, canvas, div, context) { // 파일 읽기 후 미리보기 설정
    console.log(canvas)
    if (!file) return
    const reader = new FileReader();
    canvas.style.display = 'flex'; // 예시로 보여주는 방식, 실제로 사용하는 방식에 따라 다를 수 있음
    div.style.display = 'none';
    reader.onload = function (e) {
        set_canvas_preview_img(context, canvas, e.target.result);
    }; // 파일 리드 후 설정 처리
    reader.readAsDataURL(file);
}

/**
 * 미리보기 canvas 등록
 * @param context
 * @param canvas
 * @param src
 */
function set_canvas_preview_img(context, canvas, src) { // canvas 이미지 미리보기 세팅
    const img = new Image();
    img.src = src;
    img.onload = function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
}

/**
 * 기본 로고 이미지 default 세팅
 */
function set_default_log() {
    document.getElementById(DEFAULT_LOG_IMG).src = DEFAULT_LOGO_URL; // default 로고 이미지 세팅
}

/**
 * 이미지 등록 처리
 * ToDo 현재 단건 처리, 다량 처리 필요
 * @param request
 * @returns {Promise<void>}
 */
async function upload_image(request) { // 이미지 업로드 처리
    for (const question of request.question) { // 질문 리스트
        if (question.file && question.file instanceof File) { // 로고 파일 등록
            if (question.file) {
                question.imageUrl = await upload(question.file);
            }
            delete question.file
        } else if (question.file){
            question.imageUrl = question.file
            delete question.file
        }
    }
    if (request.logoUrl && request.logoUrl instanceof File) { // 로고 파일 등록
        request.logoUrl = await upload(request.logoUrl);
    }
}

function upload (file) { // 파일 업로드 공통 API
    let form = new FormData();
    form.append("file", file); // 파일
    return upload_file_api(form).then(res => {
        if (res && res.resultCode == '0') {
            return res.file.path;
        } else {
            return null;
        }
    })
    .catch(e => {
        return null;
    })
}