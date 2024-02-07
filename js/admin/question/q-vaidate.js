function resetDate () { // 날짜 리셋 처리
    const bDt = formatDateyyyyMMddWithHyphen(today)
    const eDt = formatDateyyyyMMddWithHyphen(today_7)
    $('#startDate').val(bDt);
    $('#endDate').val(eDt);
    beginDt = bDt;
    endDt = eDt
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
        modal_type = 'C';
        open_popup("시간 설정", "종료 날짜는 시작 날짜보다 늦게 설정해야 합니다.", "flex", '닫기', false) // 팝업 오픈
        resetDate()
        return false;
    }
    return true;
}

function isPrevToday (beginDt, endDt) { // 오늘 날짜 이후 설정
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (beginDt < today || endDt < today) {
        modal_type = 'C';
        open_popup("시간 설정", "날짜는 오늘 날짜 이상으로 설정해야 합니다.", "flex", '닫기', false) // 팝업 오픈
        resetDate()
        return false;
    }
    return true;
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