function answerDetail(sid) {
    const urlParams = new URLSearchParams(window.location.search);
    const fidValue = urlParams.get('fid');

    if(sid && fidValue) {
        $.ajax({
            type: 'GET',
            url: 'https://formdang-api.com/api/dj/answers/detail',
            data: {fid: fidValue, sid: sid},
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            },
            success: function (response) {
                console.log(response.answer_list);
            },
            error: function (error) {
                console.error('AJAX 요청 실패:', error);
            }
        });
    }
}