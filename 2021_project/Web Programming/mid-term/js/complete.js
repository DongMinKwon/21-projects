// parse parameter
let temp = location.href.split("?");
let para = temp[1].split(":");
let page = para[1];

// set title
// According to page's name, set different text
let title = document.querySelector(".container>span:first-child");
if(page == "withdraw") title.textContent = "Money has been withdrawn";
else if(page == "deposit") title.textContent = "Money has been deposited";
else title.textContent = "Money has been transferred";

//get objects
let home = document.querySelector("#home");
let again = document.querySelector("#again");
let gofirst = document.querySelector("#gofirst");


//According to page's name, set Another button
if(page == "withdraw") again.textContent = "Perform Another Withdraw";
else if(page == "deposit") again.textContent = "Perform Another Deposit";
else again.textContent = "Perform Another transaction";


home.addEventListener('click', function(){
  location.href = "./menu.html";
})

//According to page's name, go back to each last page.
again.addEventListener('click', function(){
  if(page == "withdraw") location.href = "./withdraw.html";
  else if(page == "deposit") location.href = "./deposit.html"
  else location.href = "./transfer.html"
})

gofirst.addEventListener('click', function(){
  location.href = "./index.html";
})
