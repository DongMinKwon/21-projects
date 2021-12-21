
//set account info

let accountId = 1234567890123456;
let pinId = 1234;
let pinFlag = 0;
let tryLeft = 5;

// get objects
let input = document.querySelector(".container>input");
let btn = document.querySelectorAll(".btn");
let text = document.querySelector(".container>span:nth-child(2)");
let returnBtn = document.querySelector(".return");
let title = document.getElementById("indexTitle");

localStorage.clear();

//set first time info and current money
if(localStorage.getItem('firstTime') == null){
  let time = new Date();
  localStorage.setItem('firstTime', time);
  localStorage.setItem('current', 2000);
}

//if this is not pin page, hide return button
returnBtn.style.display = "none";

//set pin view
function setIndex(){
  if(input.value != accountId) alert("that account number does not exist!");
  else{
    pinFlag = 1;

    title.style.display = "none";
    returnBtn.style.display = "block";
    input.value = "";
    text.textContent = "Please Enter Your PIN";
    tryLeft = 5;
  }
}

//set pin view
function setPin(){
  if(input.value != pinId){
    tryLeft -= 1;

    //if consume all tryleft, go back to index xpage
    if(tryLeft == 0){
      alert("please check Account again");
      location.href = "./index.html";
    }
    else{
      alert("Incorrect PIN. You have "+tryLeft+" attempts left");
    }
  }
  //go to menu page
  else{
    location.href = "./menu.html";
  }
}

//if click return button, go back to index page
returnBtn.addEventListener('click', function(){
  location.href = "./index.html";
});

btn.forEach(function(num, index){
  // click the enter button
  if(index == 9){
      num.addEventListener('click', setIndex);
      num.addEventListener('click', function(){
        //if this is pin page, add Listener as name setPin
        if(pinFlag == 1){
          num.removeEventListener('click', setIndex);
          num.addEventListener('click', setPin);
        }
      });
    return;
  }
  //click the delete button
  else if(index == 11){
    num.addEventListener('click',function(){
      if(input.value.length != 0) input.value = input.value.substr(0, input.value.length - 1)
    });
    return;
  }
  num.addEventListener('click', function(){
    input.value = input.value.concat(num.textContent);
  });
});
