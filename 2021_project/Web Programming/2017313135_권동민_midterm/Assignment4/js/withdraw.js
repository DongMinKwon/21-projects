
//set back button click
let back = document.querySelector(".back");

back.addEventListener('click', function(){
  location.href="./menu.html";
});

//set change money click
let money = document.querySelector(".money>span");
let images = document.querySelectorAll("img");

images.forEach(function(img, index){
  if(index == 0){
    img.addEventListener('click', function(){
      let num = Number(money.textContent);

      //if current money is already 300, alert
      if(num == 300){
        alert("$300 is limit to withdraw from the ATM");
        return;
      }
      num += 100;
      //after add 100, if the value is more than 300, just set the value 300.
      if(num > 300) money.textContent = "300";
      else money.textContent = String(num);
    })
  }
  // add 20
  else if(index == 1){
    img.addEventListener('click', function(){
      let num = Number(money.textContent);
      if(num == 300){
        alert("$300 is limit to withdraw from the ATM");
        return;
      }
      num += 20;
      if(num > 300) money.textContent = "300";
      else money.textContent = String(num);
    })
  }
  // minus 20
  else if(index == 2){
    img.addEventListener('click', function(){
      let num = Number(money.textContent);
      num -= 20;
      if(num < 0) money.textContent = "0";
      else money.textContent = String(num);
    })
  }
  // minus 100
  else{
    img.addEventListener('click', function(){
      let num = Number(money.textContent);
      num -= 100;
      if(num < 0) money.textContent = "0";
      else money.textContent = String(num);
    })
  }
})

// set Enter
let enter = document.querySelector(".enter");
let boxes = document.querySelectorAll(".box");

enter.addEventListener('click', function(){
  let setmoney = Number(money.textContent);
  let curmoney = localStorage.getItem("current");
  //check current money
  if(setmoney > curmoney){
    alert("there is no money to withdraw");
    return;
  }
  localStorage.setItem("withdraw", money.textContent);
  location.href = "./confirm.html?pg:withdraw";
})

boxes.forEach(function(box, index){
  box.addEventListener('click', function(){
    let setmoney = Number(box.firstChild.textContent);
    let curmoney = localStorage.getItem("current");
    if(setmoney > curmoney){
      alert("there is no money to withdraw");
      return;
    }
    localStorage.setItem('withdraw', box.firstChild.textContent);
    location.href = "./confirm.html?pg:withdraw"
  })
})
