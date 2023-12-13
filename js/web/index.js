let navigation;

$(document).ready(() => {
    const isLogin = () => {
        return window.localStorage.getItem('accessToken');
    }

    navigation = (url) => {
        if (isLogin()) {
            window.location.href = url;
        } else {
            window.location.href = 'https://formdang.com/admin/login.html';
        }
    }
})

$(window).load(() => {
    let top_button = document.querySelector('.bt-top');
    top_button.addEventListener('click', function(e){
        e.preventDefault();
        window.scrollTo({top: 0, behavior: 'smooth'});
    });
})