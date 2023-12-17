
$(document).ready(() => {
    $('.layer-sel').niceSelect();

    const searchParams = new URLSearchParams(location.search);

    for (const param of searchParams) {
        let key = param[0];
        let value = param[1];
        if (key == ACCESS_TOKEN) window.localStorage.setItem(key, value)
        else if (key == REFRESH_TOKEN) window.localStorage.setItem(key, value)
    }

})

$(window).load(() => {
    ESSENTIAL_LOGIN()

    FORM_LIST_API({
        page: 0,
        type: 99
    }).then(r => {
        console.log(r)
    })

})