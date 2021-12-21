let page = document.querySelectorAll(".menu");
let returnBtn = document.querySelector(".return");

//changing pages
returnBtn.addEventListener('click', function(){
  location.href = "./index.html";
});

page[0].addEventListener('click', function(){
  location.href = "./info.html";
})

page[1].addEventListener('click', function(){
  location.href = "./withdraw.html";
})

page[2].addEventListener('click', function(){
  location.href = "./deposit.html";
})

page[3].addEventListener('click', function(){
  location.href = "./transfer.html";
})
