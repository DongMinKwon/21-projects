
let info_container = $('.container');
let grid = $('.grid_container');
let off_button = $('#off');
let add_btn = $('#enter');
let save = $('#save');
let close = $('#close');

let items = [];
let boxes = $('.box');

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

$(document).ready(function(){
  if(localStorage.length == 0){
    localStorage.setItem("items", JSON.stringify([]));
  }

  items = JSON.parse(localStorage.getItem('items'));

  setItem();

  off_button.on('click', function(){
    info_container.fadeOut(500);
    $('.overlay').hide();
  });

  close.on('click', function(){
    info_container.fadeOut(500);
    $('.overlay').hide();
  });

  add_btn.on('click', function(){
    boxes.each(function(index, box){
      $(box).val('');
    })
    info_container.fadeIn(500);
    $('.overlay').show();
  });

  save.on('click', function(){
    let chk = 0;

    let url;
    let title;
    let type;
    let desc;

    boxes.each(function(index, box){

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
        info_container.fadeOut(500);
        $('.overlay').hide();
        setItem();
    }
  })

})
