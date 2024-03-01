const results = [];
var empty = [];

function submitAnswer() {
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
