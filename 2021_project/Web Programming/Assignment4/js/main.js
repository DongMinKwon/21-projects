let default_msg = ["Please enter your first name!", "Please enter your last name!",
"Please enter your email!", "Please enter your password!", "Please re-enter your email!"
];

let warning = ["Your first name is invalid!", "Your last name is invalid!", "Your email is invalid",
"requirement: At least 6 characters, one capital letter, one lowercase letter, at least one digit and one special character!",
"Password does not match"];

let account = {};
let error_chk = 0;
let chk_count = 0;
let select_num = 1;

// first, hiding all message, icons
let message = $('.message');
message.hide();
$('.message2').hide();
$('i').hide();

let boxes = $('.box');

let password_box;

$('.complete').hide();

// when click select box, initialize
function init(){
  $('i').hide();
  $('.align').show();
  $('.complete').hide();

  message.hide();
  $('.message2').hide();
  boxes.css("border-color", "white");
  boxes.val('');
  $('input[name=gender]').prop('checked', false);
}

//check email form with regular expression
function email_chk(email) {
	var reg = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
	return reg.test(email);
}

//check name form with regular expression
function name_chk(name){
  var reg = /^[A-Z][a-zA-Z]*$/;
  return reg.test(name)
}

function password_chk(password){
  var reg= /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,}$/;
  return reg.test(password);
}

//if the form is not correct, we set the border color to red
function err(object, index){
  object.css("border-color", "red");
  $('.icon').eq(index).hide();
}

//if the form is correct, we set the border color to white
function correct(object, index){
  object.css("border-color", "white");
  $('.icon').eq(index).show();
}

function msg_check(index, box){
  let flag = false;

 //check each box's error
  switch(index){
    case 0:
      flag = name_chk($(box).val());
      break;
    case 1:
      flag = name_chk($(box).val());
      break;
    case 2:
      flag = email_chk($(box).val());
      break;
    case 3:
      flag = password_chk($(box).val());

      //check confirm password, if different, set message
      if(select_num == 1 && $(box).val() != boxes.eq(index+1).val()){
        error_chk++;
        message.eq(index+1).text(warning[index+1]);
        message.eq(index+1).show();
        err(boxes.eq(index+1), index+1);
      }
      else if ($(box).val() == boxes.eq(index+1).val()) {
        message.eq(index+1).hide();
        correct(boxes.eq(index+1), index+1);
      }

      break;
    case 4:
      console.log(password_box.val());
      if($(box).val() == password_box.val()) flag = true;
      else flag = false;
      break;
  }

  //if flag is true, hiding message and execute correct function
  if(flag){
    message.eq(index).hide();
    correct($(box), index);
  }
  else{
    error_chk++;
    //if this is password message, set message width
    if(index == 3){
      message.eq(index).css('white-space', 'normal');
      message.eq(index).css('width', '230px');
    }
    message.eq(index).text(warning[index]);
    message.eq(index).show();
    err($(box), index);
  }
}

$(document).ready(function(){

  $('#login').on('click', function(){
    select_num = 0;

    //initialize setting
    init();

    //when click login select box, add class 'sel-active' to id login div
    $('#login').removeClass('sel-nonactive');
    $('#login').addClass('sel-active');
    $('#sign_up').removeClass('sel-active');
    $('#sign_up').addClass('sel-nonactive');
    $('.hide').hide();

    //changing texts
    $('#Login_txt').text('Login');
    $('#context').text('Enter User name and password');
    $('#context').css('color', 'white');
    $('.btn>span').text('Login');
  });

  $('#sign_up').on('click', function(){
    select_num = 1;

    //initialize setting
    init();

    //when click login select box, add class 'sel-active' to id div
    $('#sign_up').removeClass('sel-nonactive');
    $('#sign_up').addClass('sel-active');
    $('#login').removeClass('sel-active');
    $('#login').addClass('sel-nonactive');

    //show all hided boxes
    $('.hide').show();

    //set texts
    $('#Login_txt').text('Sign up');
    $('#context').text('Fill in the form');
    $('#context').css('color', 'white');
    $('.btn>span').text('Sign up');
  });

  boxes.each(function(index, box){
    $(box).keyup(function(e){

      //get password_box
      password_box = boxes.eq(3);

      //if the each box is empty, we show default message("please enter")
      if($(box).val()==''){
        message.eq(index).text(default_msg[index]);
        message.eq(index).show();
        message.eq(index).css("white-space", "nowrap");
        message.eq(index).css("width", '');
        err($(box), index);
      }
      //else, error check
      else {
        msg_check(index, box);
      }
    })
  })

  $('input[name=gender]').click(function(){
    $('.message2').hide();
    $('#radio_icon').show();
  })

  $('.btn').click(function(){
    //initialize error_chk count
    error_chk = 0;
    chk_count = 0;

    //if sign up
    if(select_num == 1){

      password_box = boxes.eq(3);
      boxes.each(function(index, box){
          if($(box).val()==''){
            message.eq(index).css("white-space", "nowrap");
            error_chk++;
            message.eq(index).text(default_msg[index]);
            message.eq(index).show();
            err($(box), index);
          }
          else {
            msg_check(index, box);
          }
      })

      //radio check
      $('input[name=gender]').each(function(index, item){

        if(!$(item).prop("checked")) chk_count++;
      })

      //if radio box is checked, and all boxes have correct text, then storing account
      if(error_chk == 0 && chk_count == 1){
        account[boxes.eq(2).val()] = password_box.val();
        $('.align').hide();
        $('.complete').text('You are signed up');
        $('.complete').show();
      }
      else{
        console.log("Error...");
      }

      //radio message show
      if(!$('input[name=gender]').prop('checked')){
        $('.message2').show();
      }
    }
    //if login
    else{
      if(boxes.eq(2).val() == ''){
        message.eq(2).css("white-space", "nowrap");
        error_chk++;
        message.eq(2).text(default_msg[2]);
        message.eq(2).show();
        err(boxes.eq(2), 2);
      }
      else{
          msg_check(2, boxes.eq(2));
      }

      if(boxes.eq(3).val() == ''){
        message.eq(3).css("white-space", "nowrap");
        error_chk++;
        message.eq(3).text(default_msg[3]);
        message.eq(3).show();
        err(boxes.eq(3), 3);
      }
      else{
          msg_check(3, boxes.eq(3));
      }

      //if all form of input box is correct
      if(error_chk == 0){
        //check account's id, password
        if(account[boxes.eq(2).val()] == boxes.eq(3).val()){
          $('.align').hide();
          $('.complete').text('You are logged in');
          $('.complete').show();
          $('.row').hide();
        }
        else{
          $('#context').text('Credential do not match');
          $('#context').css("color", "red");
        }
      }



    }


  });

})
