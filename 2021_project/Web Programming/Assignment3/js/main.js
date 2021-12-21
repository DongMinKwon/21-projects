
//variables
let data1 = ["which is not valid data type in Javascript", "undefinded", "Boolean",
"float", "Number"];
let data2 = ["Purpose of designing the Javascript", "To Perform Server Side Scripting Opertion",
 "To add Interactivity to HTML Pages", "To Style HTML Pages", "All of the above"];
let data3 = ["Why so JavaScript and Java have similar name?", "They both originated on the island of Java", "JavaScript's syntax is loosely based on Java's",
"Both A and B", "None of the above"];
let data4 = ["Original Name of Javascript is", "Mocha", "LiveScript",
"Escript", "Javascript"];
let data5 = ["which type of language is Javascript", "Programming", "Scripting",
"Markup", "None of the above"];

let datas = [data1, data2, data3, data4, data5];
let answer = [3, 2, 2, 1, 2];
let chk = [false, false, false, false, false];

let dataNum = 0;
let level = 1;

let quiz = document.querySelector(".quiz");
let tiles_info = document.querySelectorAll(".tile>div:last-child");
let tiles = document.querySelectorAll(".tile");
let quest_level = document.querySelector(".question>div:first-child");
let boxes = document.querySelectorAll(".level>div");
let mini_score = document.querySelector(".score>div:last-child");

let score = 0;

//function
function init(){

  //make random number(0~4)
  dataNum = Math.floor(Math.random() * 5);
  chk[dataNum] = true;

  quiz.textContent = datas[dataNum][0];
  tiles_info.forEach(function(tile_info, index){
    tile_info.textContent = datas[dataNum][index + 1];
  });
}

//if already visited, set new number
function check_visit(){
  do{
    dataNum = Math.floor(Math.random() * 5);
  }while(chk[dataNum] == true)

  return dataNum;
}


init();

tiles.forEach(function(tile, index){
  tile.addEventListener("click", function(){
    //answer check
    if(answer[dataNum] == index + 1){
      score++;
      tiles_info[index].style.backgroundColor = "#22B14C";
      console.log("Yes!!");

    }
    else{
      tiles_info[index].style.backgroundColor = "#B80000";
      console.log("No...");

    }

    setTimeout(function(){

      //add level, set background to white
      level++;
      tiles_info[index].style.backgroundColor = "#FFFFFF"

      //if level is 5, changing page
      if(level > 4){
        location.href = "./scoreBoard.html?score:"+String(score);
        return;
      }

      //chk false
      dataNum = check_visit();
      chk[dataNum] = true;

      //level0 background change
      boxes.forEach(function(box, index){
        if(index < level) box.style.backgroundColor = "#56A5EB";
      })

      //text change
      quest_level.textContent = "Question " + String(level)+"/4";
      mini_score.textContent = String(score);


      quiz.textContent = datas[dataNum][0];
      tiles_info.forEach(function(tile_info, index){
        tile_info.textContent = datas[dataNum][index + 1];
      })

    }, 1000);
  })
});
