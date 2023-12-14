//mobile menu
let menu = document.querySelector('.bt-menu');
let menu_open = document.querySelector('.mob-head');

menu.addEventListener('click', function(){
    menu_open.classList.toggle('open');
    this.classList.toggle('close');
});

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

//floating
let floating = document.querySelector('.floating');
let btn_floating = document.querySelector('.floating-menu');
let item_floating = document.querySelector('.floating_item');

if (btn_floating) {
    btn_floating.addEventListener('click', function(){
        floating.classList.toggle('open');
    });
}

//tabmenu
let tab_item = document.querySelectorAll('.tab_item');
let tab_cont = document.querySelectorAll('.tab_cont');

tab_item.forEach((item, index) => {
    item.addEventListener("click", (e) => {
        e.preventDefault();
        tab_cont.forEach((content) => {
            content.classList.remove('active');
        });
        tab_item.forEach((content) => {
            content.classList.remove('active');
        });
        tab_item[index].classList.add('active');
        tab_cont[index].classList.add('active');
    });
});

//alert modal layer
var modal_layer = document.getElementById("modal_layer");
var open_modal_btn = document.getElementsByClassName("open_modal");
var close_modal_btn = document.getElementsByClassName("bt_close");
var funcs = [];

function modals(num){
    return function(){
        open_modal_btn[num].onclick = function(){
            modal_layer.style.display = "flex";
            document.body.style.overflow = "hidden";
        };

        close_modal_btn[0].onclick = function(){
            modal_layer.style.display = "none";
            document.body.style.overflow = "auto";
        };
    }
}


for(var i = 0; i < open_modal_btn.length; i++){
    funcs[i] = modals(i);
}

for(var j = 0; j < open_modal_btn.length; j++){
    funcs[j]();
}

function getUserFromToken(token) {
    const [, payloadBase64] = token.split('.');
    
    function base64Decode(base64) {
        const padding = '='.repeat((4 - (base64.length % 4)) % 4);
        const base64Url = (base64 + padding).replace(/\-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64Url));
    }
    const payload = base64Decode(payloadBase64);
    return payload.id;
}
