let default_msg = [
"Please enter user name!", "Please enter your email!", "Please enter your password!", "Please re-enter your email!"
];

let warning = ["Name is invalid", "Your email is invalid",
"requirement: At least 6 characters, one capital letter, one lowercase letter, at least one digit and one special character!",
"Password does not match"];

let header = $('.header');
let list = $('.list');

let items = [];
let grid = $('.grid_container');
let save = $('#save');

let home = $('#home');
let login = $('#login');
let book = $('#book');
let contact = $('#contact');

let homeCt = $('.home_content');
let loginCt = $('.login_content');
let bookCt = $('.book_content');
let contactCt = $('.contact_content');

let text_title = $('#text');

let loginBtn = $('#login_btn');
let registryBtn = $('#registry_btn');
let addBook = $('#enter');
let container = $('.container');
let setBook = $('.set_book');
let hide_box = $('.hide');
let boxes = $('.box');
let boxes2 = $('.box2');
let close = $('#off');
let set_close = $('#off2');

let login_submit = $('#submit1');
let registry_submit = $('#submit2');

let message = $('.message');

let password_box;

let param_type = $('#hidn');

let error_chk = [0, 0, 0, 0];
let select_num = 0;

function makeItem(url, title, type, desc){
  let div = "<div class='item'> \
    <div class='trash_align'><div class='trash'><i class='fas fa-trash-alt'></i></div></div> \
    <img src="+url+" alt='no_image'> \
    <div class='content'> \
      <div class='title'>"+title+"</div> \
      <div class='descript'>"+desc+"</div> \
      <div class='type'>"+type+"</div> \
    </div> \
  </div>";

  return div;
}

function setItem(){
  let tiles = JSON.parse(localStorage.getItem('items'));

  grid.empty();

  for(let idx in tiles){
    grid.append(makeItem(tiles[idx][0], tiles[idx][1], tiles[idx][2], tiles[idx][3]));
  };

  setTrash();

}

//if there is item, can click trash icon

function setTrash(){
  let trash = $('.trash');

  trash.each(function(index, tr){
    $(tr).on('click', function(){
      items.splice(index, 1);
      localStorage.setItem("items", JSON.stringify(items));
      setItem();
    });
    $(tr).hover(function(){
      $(this).css("background-color", "rgb(254, 112, 136)");
      $(this).css("color", "white");
    }, function(){
      $(this).css("background-color", "white");
      $(this).css("color", "rgb(254, 112, 136)");
    });

  })

}


//check login
function login_check(){
  if(boxes.eq(1).val() == '') return false;

  for(var i = 0; i<4; i++) if(error_chk[i] == 1) return false;

  param_type.val(String(select_num));

  return true;
}

//check email form with regular expression
function email_chk(email) {
	var reg = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
	return reg.test(email);
}

function password_chk(password){
  var reg= /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,}$/;
  return reg.test(password);
}


function msg_check(index, box){
  let flag = false;

 //check each box's error
  switch(index){
    case 0:
      flag = true;
      break;
    case 1:
      flag = email_chk($(box).val());
      break;
    case 2:
      flag = password_chk($(box).val());

      //check confirm password, if different, set message
      if(select_num == 1 && $(box).val() != boxes.eq(index+1).val()){
        error_chk[index+1] = 1;
        message.eq(index+1).text(warning[index+1]);
        message.eq(index+1).show();
      }
      else if ($(box).val() == boxes.eq(index+1).val()) {
        error_chk[index+1] = 0;
        message.eq(index+1).hide();
      }
      break;
    case 3:
      if($(box).val() == password_box.val()) flag = true;
      else flag = false;
      break;
  }

  //if flag is true, hiding message and execute correct function
  if(flag){
    error_chk[index] = 0;
    message.eq(index).hide();
  }
  else{
    error_chk[index] = 1;
    //if this is password message, set message width
    if(index == 2){
      message.eq(index).css('white-space', 'normal');
      message.eq(index).css('width', '600px');
    }
    message.eq(index).text(warning[index]);
    message.eq(index).show();
  }
}



$(document).ready(function(){

  if(localStorage.length == 0){
    localStorage.setItem("items", JSON.stringify([]));
  }

  items = JSON.parse(localStorage.getItem('items'));

  setItem();

  message.hide();
  addBook.hide();

  //when click each list item.
  home.on('click', function(){
    homeCt.show();
    loginCt.hide();
    bookCt.hide();
    contactCt.hide();
    addBook.hide();
    header.css('backgroundColor', '#C4F2D3');
    list.css('backgroundColor', '#C4F2D3');
  })

  login.on('click', function(){
    homeCt.hide();
    loginCt.show();
    bookCt.hide();
    contactCt.hide();
    addBook.hide();
    header.css('backgroundColor', '#C4F2D3');
    list.css('backgroundColor', '#C4F2D3');
  })

  book.on('click', function(){
    homeCt.hide();
    loginCt.hide();
    bookCt.show();
    contactCt.hide();
    addBook.show();
    header.css('backgroundColor', '#FFFFFF');
    list.css('backgroundColor', '#FFFFFF');
  })

  contact.on('click', function(){
    homeCt.hide();
    loginCt.hide();
    bookCt.hide();
    contactCt.show();
    addBook.hide();
    header.css('backgroundColor', '#C4F2D3');
    list.css('backgroundColor', '#C4F2D3');
  })

  //when click login button
  loginBtn.on('click', function(){
    select_num = 0;
    text_title.text("Login Page");
    login_submit.show();
    registry_submit.hide();

    for(var i = 0; i<4; i++) error_chk[i] = 0;

    boxes.each(function(index, box){
        message.hide();
        $(box).val('');
    })
    hide_box.hide();
    container.fadeIn(500);
    $('.overlay').show();
  })

  //when click registry button
  registryBtn.on('click', function(){
    select_num = 1;
    text_title.text("Registry Page");
    login_submit.hide();
    registry_submit.show();

    for(var i = 0; i<4; i++) error_chk[i] = 0;

    boxes.each(function(index, box){
        message.hide();
        $(box).val('');
    })
    hide_box.show();
    container.fadeIn(500);
    $('.overlay').show();
  })

  close.on('click', function(){
    container.fadeOut();
    $('.overlay').hide();
  })

  boxes.each(function(index, box){
    $(box).keyup(function(e){

      //get password_box
      password_box = boxes.eq(2);

      //if the each box is empty, we show default message("please enter")
      if($(box).val()==''){
        error_chk[index] = 1;
        message.eq(index).text(default_msg[index]);
        message.eq(index).show();
        message.eq(index).css("white-space", "nowrap");
        message.eq(index).css("width", '');
      }
      //else, error check
      else {
        msg_check(index, box);
      }
    })
  })

  addBook.on('click', function(){
    boxes2.each(function(index, box){
      $(box).val('');
    })
    $('.overlay').show();
    setBook.fadeIn(500);
  })

  set_close.on('click', function(){
    $('.overlay').hide();
    setBook.fadeOut();
  })

  save.on('click', function(){
    let chk = 0;

    let url;
    let title;
    let type;
    let desc;

    boxes2.each(function(index, box){

      if(chk == 1) return;
      if($(box).val() == ''){
        alert("please answer all boxes");
        chk = 1;
      }
      else{
        if(index == 0) url = $(box).val();
        else if(index == 1) title = $(box).val();
        else if(index == 2) type = $(box).val();
        else if(index == 3) desc = $(box).val();
      }
    });
    if(chk == 1) return;
    else{
        let item = [url, title, type, desc];
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
        setBook.fadeOut(500);
        $('.overlay').hide();
        setItem();
    }
  })
})
