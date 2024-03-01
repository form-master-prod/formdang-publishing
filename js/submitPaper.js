const results = [];
var empty = [];

function submitAnswer() {


    const urlParams = new URLSearchParams(window.location.search);
    const fidValue = urlParams.get('fid');
    const type = urlParams.get('type');
    const key = urlParams.get('key');
    const gidValue = urlParams ? urlParams.get('gid') || '' : '';
    console.log(fidValue)
    console.log(type)
    console.log(key)
    console.log(gidValue)

    // if(fidValue && type && key) {
    //       $.ajax({
    //           type: 'POST',
    //           url: 'https://formdang-api.com/api/dj/answers/flag',
    //           contentType: 'application/json',
    //           data: JSON.stringify({type: type,
    //                                 key: key,
    //                                 fid: fidValue,
    //                                 gid: gidValue,
    //                                 results: results
    //           }),
    //           headers: {
    //               'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
    //           },
    //           success: function (response) {
    //               if(response.proc == "success") {
    //
    //               }else {
    //                    alert("처리 중 문제가 발생했습니다.");
    //                    return false;
    //               }
    //           },
    //           error: function (error) {
    //               console.error('AJAX 요청 실패:', error);
    //           }
    //       });
    // }

    console.log(results);
    console.log("답변 제출");
    closeModal()
}

function submitPaper() {
    empty = []
    const innerDiv = document.querySelector('.inner');
    const questions = innerDiv.querySelectorAll('.frm-area');
    questions.forEach(processQuestion);

    if(empty.length > 0) {
        answerModal("e");
    }else {
        answerModal("f");
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

    results[number] = {
        type: numberElement.getAttribute('data-question'),
        qid: numberElement.getAttribute('data-qid'),
        answer: value
    };
}

const paper_answer = document.getElementById("paper_answer");
function answerModal(type) {
      let html = "";
      if(type == "e") {
          html = `
                <p>작성하지 않은 문항이 있습니다.</p>
                <p>제출하시겠습니까?</p>
          `
      }else if(type == "a") {
          html = `
                <p>제출하시겠습니까?</p>
          `
      }
      $("#modal_content").empty();
      $("#modal_content").append(html);
      paper_answer.style.display = "flex";
      document.body.style.overflow = "hidden";
}

function closeModal() {
      paper_answer.style.display = "none";
      document.body.style.overflow = "auto";
}
