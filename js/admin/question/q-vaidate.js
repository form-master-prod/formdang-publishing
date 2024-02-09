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
        open_popup("시간 설정", "종료 날짜는 시작 날짜보다 늦게 설정해야 합니다.", "flex", '닫기', false, 'C') // 팝업 오픈
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
        open_popup("시간 설정", "날짜는 오늘 날짜 이상으로 설정해야 합니다.", "flex", '닫기', false, 'C') // 팝업 오픈
        reset_date()
        return false;
    }
    return true;
}

/**
 * 객관식 정답 설정 확인
 * @param answer
 * @returns {*}
 */
function check_answer(answer) {
    return answer.find(e => {
        if (e) return true
        else return false
    })
}

/**
 * 작성하기 요청 값 검사
 * @param request
 * @returns {boolean}
 */
function validate_write_request(request) { // 폼 설정 유효성 검사
    const short = 0, subject = 1, multiple = 2, look = 3; // 단답형, 서술형, 객관식, 보기문항

    if (!request.beginDt || !request.endDt) { // 날짜 검사
        short_open_popup("기간 설정", "폼 설문 기간을 설정해주세요.")
        return false;
    } else if (!request.title) { // 제목 검사
        short_open_popup("폼 제목", "폼 제목을 작성해주세요.")
        return false;
    } else if (!request.detail) { // 폼 내용 검사
        short_open_popup("폼 설명", "폼 설명을 작성해주세요.")
        return false;
    } else if (!request.question || request.question.length == 0) { // 질문 입력 검사
        short_open_popup("질문 설정", "한개 이상의 질문을 작성해주세요.")
        return false;
    }

    for (let q of request.question) {
        if (q.type == short) {
            if (!q.title) { // 단답형 제목 검사
                short_open_popup(`단답형 설정`, `단답형 문항 제목을 작성해주세요.`, q.order+1)
                return false;
            } else if (!q.answer || q.answer.length == 0) {
                short_open_popup(`단답형 내용`, `단답형 문항 내용을 작성해주세요.`, q.order+1)
                return false;
            }
        } else if (q.type == subject) {
            if (!q.title) { // 서술형 제목 검사
                short_open_popup("서술형 제목", `서술형 문항 제목을 작성해주세요.`, q.order+1)
                return false;
            }
        } else if (q.type == multiple) {
            if (!q.title) { // 객관식 제목 검사
                short_open_popup("객관식 제목", `객관식 문항 제목을 작성해주세요.`, q.order+1)
                return false;
            } else if(!q.detail || q.detail.length == 0) { // 객관식 내용 검사
                short_open_popup("객관식 내용", `객관식 문항 내용을 작성해주세요.`, q.order+1)
                return false;
            } else if (!q.answer || q.answer.length == 0 || !check_answer(q.answer)) {
                short_open_popup("객관식 정답", `객관식 문항 정답을 선택해주세요.`, q.order+1)
                return false
            }
        } else if (q.type == look) {
            if (!q.title) { // 객관식 제목 검사
                short_open_popup("보기 제목", `보기문항 제목을 작성해주세요.`, q.order+1)
                return false;
            } else if(!q.detail || q.detail.length == 0) { // 객관식 내용 검사
                short_open_popup("보기 내용", `보기 문항 내용을 작성해주세요.`, q.order+1)
                return false;
            } else if(!q.exampleDetail || q.exampleDetail.length == 0) { // 객관식 내용 검사
                short_open_popup("보기 내용", `보기 문항 내용을 작성해주세요.`, q.order+1)
                return false;
            } else if (!q.answer || q.answer.length == 0 || !check_answer(q.answer)) {
                short_open_popup("보기 정답", `보기 문항 정답을 선택해주세요.`, q.order+1)
                return false
            }
        }
    }

    return true;
}

/**
 * 유효성 검사 false 팝업 디테일 처리
 * @param title
 * @param content
 * @param order
 */
function short_open_popup(title, content, order) {
    open_popup(title, order != null ? `<strong style="color: red">${order}번</strong> ${content}` : content, "flex", '닫기', false, 'C') // 팝업 오픈
}


$(document).ready(() => { // 초기 설정
    reset_date(); // 날짜 데이터 초기화
    $('#startDate, #endDate').change(function () { watching_date() }); // 날짜 유효성 검사
})