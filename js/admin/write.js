const emptyStateHTML = `
    <div class="not-result">
        <i class="ico"></i>
        <p>앗 ! 등록된 질문이 없어요.<br>버튼을 클릭하여 질문을 등록해주세요.</p>
        <ul>
            <li><a href="javascript:alert('링크를 연결하세요!');" class="st-ico"><i class="ico i-short-answer"></i> <span>주관식 문항</span></a></li>
            <li><a href="javascript:alert('링크를 연결하세요!');" class="st-ico"><i class="ico i-multiple"></i> <span>객관식 문항</span></a></li>
        </ul>
    </div>
`;

const subjectivityHTML = `
    <div class="frm-area short-answer">
        <div class="inp-group">
            <i class="number">1</i>
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
<div class="frm-area multiple-choice">
  <div class="inp-group">
    <i class="number">2</i>
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
    <button type="button" class="bt-delete" title="삭제"><span class="skip" onclick="deleteContent(event)">삭제</span></button>
  </div>
</div>
`;

const addSubjectivity = () => {
    $("#first_content").append(subjectivityHTML);
}

const addMultipleChoice = () => {
    $("#first_content").append(multipleHTML);
}

// 컨텐츠 삭제 이벤트
function deleteContent(event) {
    console.log('삭제')
    $(event.target).closest('.frm-area').remove();
}

$(document).ready(() => {
    $(".bt-delete").on("click", deleteContent);
})

$(window).load(() => {
    ESSENTIAL_LOGIN()

})