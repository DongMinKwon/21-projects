
let score_text = document.querySelector(".text");

//if location is scoreBoard.html -> get score parameter
let tmp = location.href.split("?");

let data = tmp[1].split(":");
let score = data[1];
score_text.textContent = "Total Score: "+ score;
