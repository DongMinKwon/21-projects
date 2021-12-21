
//parse parameters
let temp = location.href.split("?");
let para=temp[1].split(":");
page = para[1];

//set no button click
let no = document.querySelector("#no");

//According to pages' name, go back to last page.
no.addEventListener('click', function(){
  if(page == "withdraw") location.href = "./withdraw.html";
  else if(page == "deposit") location.href = "./deposit.html";
  else location.href = "./transfer.html";
});

//set text
let title = document.querySelector(".confirm>span:first-child");
if(page == "withdraw") title.textContent="Withdraw";
else if(page == "deposit"){
  title.style.fontSize = "30px";
  title.textContent="Are you sure you want to deposit the amount specified?";
}
else{
  title.textContent="Transfer?";
}

// if it is transfer page, display texts.
let transAcc = document.querySelectorAll(".transfer");
if(page == "transfer"){
  transAcc[0].style.display = "block";
  transAcc[1].style.display = "block";
}

//set money from localStorage

let text = document.querySelector("#text");

//if the page's name is deposit, get "deposit" value from localStorage
if(page == "deposit") {
  var money = localStorage.getItem("deposit");

}
else{
  var money = localStorage.getItem("withdraw");
}

text.textContent = "$"+money+"?";

//set yes button click

let yes = document.querySelector("#yes");

yes.addEventListener('click', function(){
  let newcurrent = Number(localStorage.getItem('current'));
  let dataList = JSON.parse(localStorage.getItem("dataList"));

  //if the page's name is deposit, add money to newcurrent
  if(page =="deposit"){
    newcurrent += Number(money);
    var newdata = [[String(new Date()), 0, money, newcurrent]];
  }
  //else(withdraw of transfer), minus money to newcurrent
  else{
    newcurrent -= Number(money);
    var newdata = [[String(new Date()), money, 0, newcurrent]];
  }

  //set list of data(add new item to list)
  if(dataList == null){
    localStorage.setItem('dataList', JSON.stringify(newdata));
  }
  else{
    dataList = dataList.concat(newdata);
    localStorage.setItem('dataList', JSON.stringify(dataList));
  }

  localStorage.setItem('current', newcurrent);

  //changing page according to page name.
  if(page == "deposit"){
    location.href = "./putmoney.html";
  }
  else if(page == "withdraw") location.href = "./complete.html?pg:withdraw";
  else location.href = "./complete.html?pg:transfer";
});
