const today = new Date();
const today_7 = new Date(today);
today_7.setDate(today_7.getDate() + 7);

/**
 * 날짜 리셋 처리
 */
function reset_date () { // 날짜 리셋 처리
    const bDt = formatDateyyyyMMddWithHyphen(today)
    const eDt = formatDateyyyyMMddWithHyphen(today_7)
    $('#startDate').val(bDt);
    $('#endDate').val(eDt);
    beginDt = bDt;
    endDt = eDt
}

/**
 * 날짜 변경시 이벤트 감지 후 유효성 체크
 */
function watching_date() { // 날짜 선택 변경 시 이벤트 처리
    beginDt = $('#startDate').val();
    endDt = $('#endDate').val();
    const bDt = new Date(beginDt + 'T00:00:00Z');
    const eDt =  new Date(endDt + 'T00:00:00Z');
    if (!is_begin_dt_over_End_dt(bDt, eDt)) return; // 종료일이 시작일 이후 설정 검사
    if (!is_prev_today(bDt, eDt)) return; // 오늘 날짜 이후 설정
}

/**
 * 종료일 < 시작일 체크
 * @param beginDt
 * @param endDt
 * @returns {boolean}
 */
function is_begin_dt_over_End_dt (beginDt, endDt) { // 종료일이 시작일 이후 설정 검사
    if (endDt < beginDt) {
        modal_type = 'C';
        open_popup("시간 설정", "종료 날짜는 시작 날짜보다 늦게 설정해야 합니다.", "flex", '닫기', false) // 팝업 오픈
        reset_date()
        return false;
    }
    return true;
}

/**
 * NOW() < 시작일 체크
 * @param beginDt
 * @param endDt
 * @returns {boolean}
 */
function is_prev_today (beginDt, endDt) { // 오늘 날짜 이후 설정
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (beginDt < today || endDt < today) {
        modal_type = 'C';
        open_popup("시간 설정", "날짜는 오늘 날짜 이상으로 설정해야 합니다.", "flex", '닫기', false) // 팝업 오픈
        reset_date()
        return false;
    }
    return true;
}

/**
 * 이성 등록
 * @param element
 * @returns {boolean}
 */
function validate_checkbox(element) {
    let checkbox = $(element).find('input[type="checkbox"]');
    let inputField = $(element).find('input[type="text"]');
    let inputValue = inputField.val();

    if (inputValue === "") {
        checkbox.prop("checked", false);
        return false;
    }
    return true;
}

/**
 * 이성 등록
 * @returns {boolean}
 */
function validate_checkbox() {
    if (!validate_checkbox($(this).closest('li'))) {
        alert("객관식 내용을 입력해주세요.");
        return false
    }
}

/**
 * 이성 등록
 */
function validateText() {
    validate_checkbox($(this).closest('li'));
}

/**
 * 이성 등록
 * @param event
 * @returns {boolean}
 */
function validate_multiple_choice_setting(event) {
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

/**
 * 이성 등록
 * @param event
 */
function validate_multiple_choice_empty(event) {
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

$(document).ready(() => { // 초기 설정
    reset_date(); // 날짜 데이터 초기화
    $('#startDate, #endDate').change(function () { watching_date() }); // 날짜 유효성 검사
    $('input[type="checkbox"]').on('click', function() { validate_checkbox() });
    $('input[type="text"]').on('input', function() { validateText() });
    document.addEventListener('click', function(event) { validate_multiple_choice_setting(event) });
    document.addEventListener('input', function(event) { validate_multiple_choice_empty(event) });
})