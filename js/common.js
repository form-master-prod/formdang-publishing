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
const modal_layer = document.getElementById("modal_layer");
const openModalBtn = document.getElementById("open_modal");
const closeModalBtn = document.getElementById("bt_close");

openModalBtn.addEventListener("click", () => {
  modal_layer.style.display = "flex";
  document.body.style.overflow = "hidden";
});

closeModalBtn.addEventListener("click", () => {
  modal_layer.style.display = "none";
  document.body.style.overflow = "auto";
});