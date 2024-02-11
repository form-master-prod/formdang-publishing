$(function(){
    answerDetail()
});



function answerDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const fidValue = urlParams.get('fid');
    const sidValue = urlParams.get('sid');

    if(sidValue && fidValue) {
        $.ajax({
            type: 'GET',
            url: 'https://formdang-api.com/api/dj/answers/detail',
            data: {fid: fidValue, sid: sid},
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            },
            success: function (response) {
                console.log(response.answer_list);
                const length = response.answer_list.length;
                const data = response.answer_list;
                let html = ''
                if(length > 0) {
                    for(let i=0; i<length; i++) {
                        //  ( 0: 단답형, 1: 서술형, 2: 객관식, 3: 보기문 )
                        let number = i + 1
                        // 이미지 HTML
                        let html_img = ''
                        if ([null, undefined, '', 'None', 'null'].includes(data[i].image)) {
                            html_img = `<img src="${data[i].image}" alt="">`
                        }


                        // 버튼 HTML
                        let html_btn = ''
                        if(data[i].ok_flag == 1) {
                            html_btn = `<button type="button" class="st-ico" onclick="okFlagChange('${data[i].awid}')"><span>오답처리</span></button>`;
                        }else {
                            html_btn = `<button type="button" class="st-ico" onclick="okFlagChange('${data[i].awid}')"><span>정답처리</span></button>`;
                        }


                        if(data[i].type == 0) {
                            let result = ''
                            let s_answer = String(data[i].s_answer).trim();
                            if (![null, undefined, '', 'None', 'null'].includes(s_answer)) {
                                result = s_answer;
                            }

                            html += `
                                <div class="frm-area short-answer">
                                    <div class="inp-group">
                                        <i class="number">${number}</i>
                                        <h4>${data[i].question}</h4>
                                        <p class="img-view">${html_img}</p>
                                        <input type="text" name="" value="${result}" class="it" readonly="" disabled="" style="margin-top: 10px;">
                                    </div>
                                    ${html_btn}
                                </div>
                            `
                        }else if(data[i].type == 1) {
                            let result = ''
                            let s_answer = String(data[i].s_answer).trim();
                            if (![null, undefined, '', 'None', 'null'].includes(s_answer)) {
                                result = s_answer;
                            }
                            html += `
                                <div class="frm-area short-answer">
                                    <div class="inp-group">
                                        <i class="number">${number}</i>
                                        <h4>${data[i].question}</h4>
                                        <p class="img-view">${html_img}</p>
                                        <textarea name="" id="" cols="" rows="" readonly>${result}</textarea>
                                    </div>
                                    ${html_btn}
                                </div>
                            `
                        }else if(data[i].type == 2) {
                            html += `
                                <div class="frm-area multiple-choice">
                                    <div class="inp-group">
                                        <i class="number">${number}</i>
                                        <h4>${data[i].question}</h4>
                                        <p class="img-view">${html_img}</p>
                                        <ol class="subject-valid">
                                            <li>
                                                <span class="ctm-chk"><input type="checkbox" name="each" value="1"><label class="skip">객관식 1</label></span>
                                                <span class="inp">1. 객관식 내용을 입력하세요.</span>
                                            </li>
                                            <li>
                                                <span class="ctm-chk"><input type="checkbox" name="each" value="2"> <label class="skip">객관식 2</label></span>
                                                <span class="inp">2. 객관식 내용을 입력하세요.</span>
                                            </li>
                                            <li>
                                                <span class="ctm-chk"><input type="checkbox" name="each" value="3"> <label class="skip">객관식 3</label></span>
                                                <span class="inp">3. 객관식 내용을 입력하세요.</span>
                                            </li>
                                            <li>
                                                <span class="ctm-chk"><input type="checkbox" name="each" value="4"> <label class="skip">객관식 4</label></span>
                                                <span class="inp">4. 객관식 내용을 입력하세요.</span>
                                            </li>
                                            <li>
                                                <span class="ctm-chk"><input type="checkbox" name="each" value="5"> <label class="skip">객관식 5</label></span>
                                                <span class="inp">5. 객관식 내용을 입력하세요.</span>
                                            </li>
                                        </ol>
                                    </div>
                                    ${html_btn}
                                </div>
                            `

                        }else if(data[i].type == 3) {
                            html += `
                                <div class="frm-area multiple-choice">
                                    <div class="inp-group">
                                        <i class="number">${number}</i>
                                        <h4>${data[i].question}</h4>
                                        <p class="img-view">${html_img}</p>
                                        <div class="que-viewitem">
                                            <p>보기</p>
                                            <ol>
                                                <li>ㄱ. 보기 내용을 입력하세요.</li>
                                                <li>ㄴ. 보기 내용을 입력하세요.</li>
                                                <li>ㄷ. 보기 내용을 입력하세요.</li>
                                                <li>ㄹ. 보기 내용을 입력하세요.</li>
                                                <li>ㅁ. 보기 내용을 입력하세요.</li>
                                            </ol>
                                        </div>
                                        <ol class="subject-valid">
                                            <li>
                                                <span class="ctm-chk"><input type="checkbox" name="each" value="1"><label class="skip">객관식 1</label></span>
                                                <span class="inp">1. 객관식 내용을 입력하세요.</span>
                                            </li>
                                            <li>
                                                <span class="ctm-chk"><input type="checkbox" name="each" value="2"> <label class="skip">객관식 2</label></span>
                                                <span class="inp">2. 객관식 내용을 입력하세요.</span>
                                            </li>
                                            <li>
                                                <span class="ctm-chk"><input type="checkbox" name="each" value="3"> <label class="skip">객관식 3</label></span>
                                                <span class="inp">3. 객관식 내용을 입력하세요.</span>
                                            </li>
                                            <li>
                                                <span class="ctm-chk"><input type="checkbox" name="each" value="4"> <label class="skip">객관식 4</label></span>
                                                <span class="inp">4. 객관식 내용을 입력하세요.</span>
                                            </li>
                                            <li>
                                                <span class="ctm-chk"><input type="checkbox" name="each" value="5"> <label class="skip">객관식 5</label></span>
                                                <span class="inp">5. 객관식 내용을 입력하세요.</span>
                                            </li>
                                        </ol>
                                    </div>
                                    ${html_btn}
                                </div>
                            `
                        }
                    }

                    $("#answer_form").append(html);
                }
            },
            error: function (error) {
                console.error('AJAX 요청 실패:', error);
            }
        });
    }
}


function okFlagChange() {

}