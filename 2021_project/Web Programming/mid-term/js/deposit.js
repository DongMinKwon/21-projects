let back = document.querySelector(".back");
let input = document.querySelector("#input");
let buttons = document.querySelectorAll(".btn");

input.value = "";

back.addEventListener('click', function(){
  location.href = "./menu.html";
})

buttons.forEach(function(btn, index){

  //if the button is delete, delete last character
  if(index == 11){
    btn.addEventListener('click', function(){
      input.value = input.value.substr(0, input.value.length - 1);
    });
    return;
  }
  //if the button is '.'
  if(index == 10){
    btn.addEventListener('click', function(){
      if(input.value.indexOf(".") !== -1){
        alert("you can't add . char after .");
      }
      else input.value += btn.textContent;
    });
    return;
  }
  //if the button is "enter"
  if(index == 12){
    btn.addEventListener('click', function(){
      //set deposit value
      localStorage.setItem('deposit', input.value);
      location.href = "./confirm.html?pg:deposit";
    });
    return;
  }
  // rest buttons
  btn.addEventListener('click', function(){
    input.value += btn.textContent;
  })
})
