//get List data from local Storage
let dataList= [["Date", "Funds Out", "Funds In", "Running Balance"], [localStorage.getItem("firstTime"), 0, 0, 2000]];
let dataListParse = JSON.parse(localStorage.getItem('dataList'))

if(dataListParse != null) dataList = dataList.concat(dataListParse);

console.log(dataList);

//find ul tag, back button object
let ul = document.querySelector("ul");
let back = document.querySelector(".back");
let balance = document.querySelector(".container>span:nth-child(2)");

balance.textContent = "Current Balance: "+localStorage.getItem('current')+"$";

back.addEventListener('click', function(){
  location.href = "./menu.html";
});

//add list items
function addLog(data){
  let newli = document.createElement("li");

  //make four div text
  for(let i = 0; i<4; i++){
    let newDiv = document.createElement("div");
    let txt = document.createTextNode(data[i]);
    newDiv.appendChild(txt);
    newli.appendChild(newDiv);
  }

  //add li in ul tag
  ul.appendChild(newli);
}

for(let j = 0; j<dataList.length; j++){
  addLog(dataList[j]);
}
