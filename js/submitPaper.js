const results = {};
var empty = [];

function submitPaper() {
    empty = []
    const innerDiv = document.querySelector('.inner');
    const questions = innerDiv.querySelectorAll('.frm-area');
    questions.forEach(processQuestion);

    if(empty.length > 0) {
        alert("작성하지 않은 문제가 있습니다.\n제출하시겠습니까 ?");
    }else {
        console.log(results);
        alert("제출완료");
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
    const number = element.querySelector('.number').innerText;
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

    results[number] = value;
}
