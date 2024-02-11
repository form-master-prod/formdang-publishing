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
            data: {fid: fidValue, sid: sidValue},
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            },
            success: function (response) {
                console.log(response.answer_list);
                const length = response.answer_list.length;
                const data = response.answer_list;
                let html = ''

                $("#form_title").text(response.title)
                $("#form_sub_title").text(response.sub_title)
                if (![null, undefined, '', 'None', 'null'].includes(response.logo)) {
                    $("#form_logo").append(`<img src="${response.logo}" alt="" style="width: 160px; height: 160px;">`)
                }

                if(length > 0) {
                    for(let i=0; i<length; i++) {
                        //  ( 0: 단답형, 1: 서술형, 2: 객관식, 3: 보기문 )
                        let number = i + 1
                        // 이미지 HTML
                        let html_img = ''
                        if (![null, undefined, '', 'None', 'null'].includes(data[i].image)) {
                            html_img = `<img src="${data[i].image}" alt="" style="width: 160px; height: 160px;">`
                        }


                        // 버튼 HTML
                        let html_btn = ''
                        if(data[i].ok_flag == 1) {
                            html_btn = `<button type="button" class="st-ico" onclick="okFlagChange('${data[i].awid}')"><span id="answer_${data[i].awid}">오답처리</span></button>`;
                        }else {
                            html_btn = `<button type="button" class="st-ico" onclick="okFlagChange('${data[i].awid}')"><span id="answer_${data[i].awid}">정답처리</span></button>`;
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
                            let arr = String(data[i].detail).split('|');
                            let m_answer = String(data[i].m_answer).split('|');
                            let detail = '';
                            for(let j=0; j < arr.length; j++) {
                                detail += `
                                    <li>
                                        <span class="ctm-chk"><input ${m_answer[j] == 'true' ? 'checked': ''} disabled readonly type="checkbox" name="each" value="${j+1}"><label class="skip">객관식 ${j+1}</label></span>
                                        <span class="inp">${j+1}. ${arr[j]}</span>
                                    </li>
                                `
                            }

                            html += `
                                <div class="frm-area multiple-choice">
                                    <div class="inp-group">
                                        <i class="number">${number}</i>
                                        <h4>${data[i].question}</h4>
                                        <p class="img-view">${html_img}</p>
                                        <ol class="subject-valid">
                                            ${detail}
                                        </ol>
                                    </div>
                                    ${html_btn}
                                </div>
                            `

                        }else if(data[i].type == 3) {
                            let arr = String(data[i].detail).split('|');
                            let m_answer = String(data[i].m_answer).split('|');
                            let example = String(data[i].example).split('|');
                            let detail = '';
                            let example_detail = '';

                            for(let j=0; j < arr.length; j++) {
                                detail += `
                                    <li>
                                        <span class="ctm-chk"><input ${m_answer[j] == 'true' ? 'checked': ''} disabled readonly type="checkbox" name="each" value="${j+1}"><label class="skip">객관식 ${j+1}</label></span>
                                        <span class="inp">${j+1}. ${arr[j]}</span>
                                    </li>
                                `
                            }

                            for(let k=0; k < example.length; k++) {
                                let example_idx = String.fromCharCode(12593 + (k*3));
                                example_detail += `
                                    <li>${example_idx}. ${example[k]}
                                `
                            }

                            html += `
                                <div class="frm-area multiple-choice">
                                    <div class="inp-group">
                                        <i class="number">${number}</i>
                                        <h4>${data[i].question}</h4>
                                        <p class="img-view">${html_img}</p>
                                        <div class="que-viewitem">
                                            <p>보기</p>
                                            <ol>
                                                  ${example_detail}
                                            </ol>
                                        </div>
                                        <ol class="subject-valid">
                                            ${detail}
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


function okFlagChange(awid) {
    const urlParams = new URLSearchParams(window.location.search);
    const fidValue = urlParams.get('fid');
    let button = $("#answer_" + String(awid)).text();
    console.log(button)
    if(awid && button) {
          $.ajax({
              type: 'GET',
              url: 'https://formdang-api.com/api/dj/answers/flag',
              data: {awid: awid, flag: button, fid: fidValue},
              headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
              },
              success: function (response) {
                  if(response.proc == "success") {

                       if(button == "오답처리") {
                            openModal('오답처리', '오답처리로 변경되었습니다.');
                            $("#answer_" + String(awid)).text('정답처리');
                       }else if(button == "정답처리") {
                            openModal('오답처리', '오답처리로 변경되었습니다.');
                            $("#answer_" + String(awid)).text('오답처리');
                       }else {

                           openModal('처리실패', '문제가 발생했습니다.');
                       }

                       return false;
                  }else {
                       alert("처리 중 문제가 발생했습니다.");
                       return false;
                  }
              },
              error: function (error) {
                  console.error('AJAX 요청 실패:', error);
              }
          });
    }


}