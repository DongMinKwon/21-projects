
//parse parameters
let back = document.querySelector(".back");
let input = document.querySelector("#input");
let buttons = document.querySelectorAll(".btn");

input.value = "";

//if click the back button, go back to menu
back.addEventListener('click', function(){
  location.href = "./menu.html";
})

buttons.forEach(function(btn, index){
  //if click delete button, delete the last character
  if(index == 11){
    btn.addEventListener('click', function(){
      input.value = input.value.substr(0, input.value.length - 1);
    });
    return;
  }
  //if click "." button
  if(index == 10){
    btn.addEventListener('click', function(){
      if(input.value.indexOf(".") !== -1){
        alert("you can add . char after .");
      }
      else input.value += btn.textContent;
    });
    return;
  }
  //if click "enter" button
  if(index == 12){
    btn.addEventListener('click', function(){
      let from = document.querySelector("#fromAcc");
      let to = document.querySelector("#toAcc");
      let cur = Number(localStorage.getItem("current"));

      //check select account
      if(from.options[from.selectedIndex].textContent != "1234567890123456" || to.options[to.selectedIndex].textContent != "1234567887654321"){
        alert("please select account!");
        return;
      }
      //if transfer money is more than current money
      if(cur < Number(input.value)){
        alert("there is no money to transfer");
        return;
      }
      localStorage.setItem('withdraw', input.value);
      location.href = "./confirm.html?pg:transfer";
    });
    return;
  }
  btn.addEventListener('click', function(){
    input.value += btn.textContent;
  })
})
