

const navigation = (url) => {
    if (IS_LOGIN()) window.location.href = url;
    else window.location.href = PAGE.LOGIN.MY;
}

$(document).ready(() => {

})

$(window).load(() => {
    let top_button = document.querySelector('.bt-top');
    top_button.addEventListener('click', function(e){
        e.preventDefault();
        window.scrollTo({top: 0, behavior: 'smooth'});
    });
})