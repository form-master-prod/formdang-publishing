
function purple_script() {
    //user modal layer
    let user = document.querySelector('.user_login');
    let modal = document.querySelector('.mem_info');
    let modal_close = document.querySelector('.bt-close');

    user.addEventListener('click', function(){
        modal.classList.add('open');
    });
    modal_close.addEventListener('click', function(){
        modal.classList.remove('open');
    });

    let top_button = document.querySelector('.bt-top');
    top_button.addEventListener('click', function(e){
        e.preventDefault();
        window.scrollTo({top: 0, behavior: 'smooth'});
    });

    let bottom_button = document.querySelector('.bt-btm');
    bottom_button.addEventListener('click', function(e){
        e.preventDefault();
        window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
    });
}

$(document).ready(() => { // 초기 설정
    purple_script();
    const params = new URLSearchParams(window.location.search);
    console.log(params.get("type"))
    console.log(params.get("fid"))
    console.log(params.get("key"))

})

$(window).load(() => {

})