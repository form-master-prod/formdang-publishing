const subjectivityHTML = `
    <div class="frm-area short-answer form-div">
        <div class="inp-group">
            <i class="number"></i>
            <label for="subject" class="skip">질문 제목</label><input type="text" name="" id="subject" placeholder="질문 제목을 입력해주세요.">
            <label for="explain" class="skip">질문 내용</label><input type="text" name="" id="explain" placeholder="주관식 질문 창에 보일 문구를 입력해주세요.">
        </div>
        <div class="frm-upload">
            <!-- 이미지 등록 -->
            <canvas id="img-view"></canvas>
            <!-- //이미지 등록 -->
            <label for="file">이미지 등록하기</label> <input type="file" name="" id="file">
        </div>
        <div class="bottom-sheets">
            <button type="button" class="bt-delete" title="삭제" onclick="deleteContent(event)"><span class="skip">삭제</span></button>
        </div>
    </div>
`;

const multipleHTML = `
<div class="frm-area multiple-choice form-div">
  <div class="inp-group">
    <i class="number"></i>
    <label for="subject" class="skip">질문 제목</label><input type="text" name="" id="subject" placeholder="질문 제목을 입력해주세요.">
    <ol>
      <li>
        <span class="ctm-radio"><input type="radio" name="" id="que1"> <label for="que1" class="skip">객관식 1</label></span>
        <span class="inp"><label for="" class="skip">객관식 1 내용</label> <input type="text" name="" value="" placeholder="1. 객관식 내용을 입력하세요."></span>
      </li>
      <li>
        <span class="ctm-radio"><input type="radio" name="" id="que2"> <label for="que2" class="skip">객관식 2</label></span>
        <span class="inp"><label for="" class="skip">객관식 2 내용</label> <input type="text" name="" value="" placeholder="2. 객관식 내용을 입력하세요."></span>
      </li>
      <li>
        <span class="ctm-radio"><input type="radio" name="" id="que3"> <label for="que3" class="skip">객관식 3</label></span>
        <span class="inp"><label for="" class="skip">객관식 3 내용</label> <input type="text" name="" value="" placeholder="3. 객관식 내용을 입력하세요."></span>
      </li>
      <li>
        <span class="ctm-radio"><input type="radio" name="" id="que4"> <label for="que4" class="skip">객관식 4</label></span>
        <span class="inp"><label for="" class="skip">객관식 4 내용</label> <input type="text" name="" value="" placeholder="4. 객관식 내용을 입력하세요."></span>
      </li>
      <li>
        <span class="ctm-radio"><input type="radio" name="" id="que5"> <label for="que5" class="skip">객관식 5</label></span>
        <span class="inp"><label for="" class="skip">객관식 5 내용</label> <input type="text" name="" value="" placeholder="5. 객관식 내용을 입력하세요."></span>
      </li>
    </ol>
  </div>
  <div class="frm-upload">
    <!-- 이미지 미등록 -->
    <div id="img-view">
      <span class="not-img"><img src="../image/icon/gallery-remove.svg" alt=""></span>
    </div>
    <!-- //이미지 미등록 -->
    <label for="file">이미지 등록하기</label> <input type="file" name="" id="file">
  </div>
  <div class="bottom-sheets">
    <button type="button" class="bt-delete" title="삭제" onclick="deleteContent(event)"><span class="skip">삭제</span></button>
  </div>
</div>
`;

const addSubjectivity = () => {
    formEmptyCheck();
    $("#first_content").append(subjectivityHTML);
    updateNumbering()
}

const addMultipleChoice = () => {
    formEmptyCheck();
    $("#first_content").append(multipleHTML);
    updateNumbering()
}

// 컨텐츠 삭제 이벤트
function deleteContent(event) {
    console.log('삭제')
    $(event.target).closest('.frm-area').remove();
    let formDivElements = document.querySelectorAll('.form-div');
    if(formDivElements.length < 1) {
        formEmpty();
    }else {
        updateNumbering();
    }

}

$(document).ready(() => {
    formEmpty()
    $(".bt-delete").on("click", deleteContent);
})

$(window).load(() => {
    ESSENTIAL_LOGIN()

})

// 비어있을 때
function formEmpty() {
    const html = `
            <div class="not-result" id="not-result">
                <i class="ico"></i>
                <p>앗 ! 등록된 질문이 없어요.<br>버튼을 클릭하여 질문을 등록해주세요.</p>
                <ul>
                    <li><a href="javascript:void(0);" onclick="addSubjectivity()" class="st-ico"><i class="ico i-short-answer"></i> <span>주관식 문항</span></a></li>
                    <li><a href="javascript:void(0);" onclick="addMultipleChoice()" class="st-ico"><i class="ico i-multiple"></i> <span>객관식 문항</span></a></li>
                    </ul>
            </div>
    `
    $("#first_content").prepend(html)
}

// 문항 생성 시 empty form 제거
function formEmptyCheck() {
    let elementToRemove = document.getElementById("not-result");
    if (elementToRemove) {
        elementToRemove.parentNode.removeChild(elementToRemove);
    }
}

// 넘버링 로직
const updateNumbering = () => {
    let formDivs = document.querySelectorAll('.inner#first_content .form-div');
    formDivs.forEach(function (formDiv, index) {
        let numberElement = formDiv.querySelector('.number');
        numberElement.textContent = index + 1;
    });
};