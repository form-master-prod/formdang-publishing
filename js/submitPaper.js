const results = [];
var isSubmitting = false;
var empty = [];

function submitAnswer() {

    const urlParams = new URLSearchParams(window.location.search);
    let fidValue = urlParams.get('fid') || sessionStorage.getItem('fid');
    let type = urlParams.get('type') || sessionStorage.getItem('type');
    let key = urlParams.get('key') || sessionStorage.getItem('key');

    if(isSubmitting) {
        console.log("Already submitting, please wait...");
        return;
    }

    if(![null, undefined, '', 'None', 'null'].includes(fidValue) &&
       ![null, undefined, '', 'None', 'null'].includes(type) &&
       ![null, undefined, '', 'None', 'null'].includes(key)) {

        isSubmitting = true;  // Start submitting

        $.ajax({
            type: 'POST',
            url: 'https://formdang-api.com/api/dj/answers/flag',
            contentType: 'application/json',
            data: JSON.stringify({
                                  type: type,
                                  key: key,
                                  fid: fidValue,
                                  results: results
            }),
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            },
            success: function (response) {
                if(response.proc == "success" || response.proc == "master") {
                    closeModal();
                    successModal(response.proc);
                } else {
                    alert("처리 중 문제가 발생했습니다.");
                }
                isSubmitting = false;  // Reset submitting status after success or failure
            },
            error: function (error) {
                console.error('AJAX 요청 실패:', error);
                isSubmitting = false;  // Reset submitting status on error
            }
        });
    } else {
        console.log("Required parameters are missing");
    }
}

function submitPaper() {
    empty = []
    const innerDiv = document.querySelector('.inner');
    const questions = innerDiv.querySelectorAll('.frm-area');
    questions.forEach(processQuestion);

    if(empty.length > 0) {
        answerModal("e");
    }else {
        answerModal("a");
    }
}

function isMultipleChoice(element) {
    return element.classList.contains('multiple-choice');
}

function isShortAnswer(element) {
    return element.classList.contains('short-answer');
}

function getTextAreaValue(element) {
    const textarea = element.querySelector('textarea');
    return textarea ? textarea.value : '';
}

function getMultipleChoiceValue(element) {
    const checkboxes = element.querySelectorAll('input[type="checkbox"]');
    const values = Array.from(checkboxes)
        .map(checkbox => checkbox.checked);
    return values.join('|');
}

function processQuestion(element) {
    const numberElement = element.querySelector('.number');
    const number = numberElement.innerText;
    const isMultiple = isMultipleChoice(element);
    const isShort = isShortAnswer(element);

    let value = '';

    if (isShort) {
        value = getTextAreaValue(element);
        if (!value.trim()) {
            empty.push(number);
        }
    } else if (isMultiple) {
        value = getMultipleChoiceValue(element);
        if (!value.includes('true')) {
            empty.push(number);
        }
    }

    results[number-1] = {
        type: numberElement.getAttribute('data-question'),
        qid: numberElement.getAttribute('data-qid'),
        answer: value
    };
}

const paper_answer = document.getElementById("paper_answer");
const answer_success = document.getElementById("answer_success");

function answerModal(type) {
      let modal_html = "";
      $("#modal_content").empty();
      if(type == "e") {
          modal_html += `
                <p>작성하지 않은 문항이 있습니다.</p>
                <p>제출하시겠습니까?</p>
          `
      }else if(type == "a") {
          modal_html += `
                <p>제출하시겠습니까?</p>
          `
      }
      console.log(modal_html)
      $("#modal_content").append(modal_html);
      paper_answer.style.display = "flex";
      document.body.style.overflow = "hidden";
}

function closeModal() {
      paper_answer.style.display = "none";
      document.body.style.overflow = "auto";
}


function successModal(type) {
    $("#success_content").empty();
    let modal_html = ""
    if(type == "success") {
        modal_html = `
            <h2>제출완료!</h2>
            <p>성공적으로 처리되었습니다.</p>
        `
    }else {
        modal_html = `
            <h2>제출실패!</h2>
            <p>폼 소유자는 제출할 수 없습니다.</p>
        `
    }

    $("#success_content").append(modal_html)
    answer_success.style.display = "flex";
    document.body.style.overflow = "hidden";
}
