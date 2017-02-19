//const fs = require('fs');
//const path = require('path');

$('.main-content').slick({
    arrows: false,
    draggable: true,
    adaptiveHeight: true,
    infinite: false
  });

var folder_path = '';
var leftSoundsArray = [];
var rightSoundsArray = [];

$('#chooseDest').click(function(){
  chooseDestFolder('#folder_dialog_input');
});

$('#left-trigger').click(function(){
  chooseFileLeft('#fileDialogLeft');
  $(this).closest('.instruction').find('h4').fadeOut();
  $(this).closest('.instruction').removeClass('instruction').appendTo('#left-file-pool').addClass('barcontrols');
  $('#left-remove').show();
});

$('#right-trigger').click(function(){
  chooseFileRight('#fileDialogRight');
  $(this).closest('.instruction').find('h4').fadeOut();
  $(this).closest('.instruction').removeClass('instruction').appendTo('#right-file-pool').addClass('barcontrols');
  $('#right-remove').show();
});

$('#left-remove').click(function(){
  $('#left-file-pool > .files').empty();
  leftSoundsArray = [];
  console.log('empty left', leftSoundsArray);
  $('#left > .fileCounter > .counter').empty();
  $('#left > .fileCounter > .counter').append(leftSoundsArray.length);
});

$('#right-remove').click(function(){
  $('#right-file-pool > .files').empty();
  rightSoundsArray = [];
  $('#right > .fileCounter > .counter').empty();
  $('#right > .fileCounter > .counter').append(rightSoundsArray.length);
});

  function chooseFileLeft(name) {
    var chooser = $(name);
    chooser.unbind('change');
    chooser.change(function(evt) {
    var files = $('#fileDialogLeft')[0].files; 
    $('#left > .fileCounter > .counter').empty();
		for (var i = 0; i < files.length; ++i){
			//console.log(files[i].name);
  			$('#left-file-pool > .files').append(`<p data-source="${files[i].path}">${files[i].name}</p>`);
        leftSoundsArray.push(files[i].path);
        console.log(leftSoundsArray);
		}
    $('#left > .fileCounter > .counter').append(leftSoundsArray.length);
    });
    chooser.trigger('click');
  }

  function chooseFileRight(name) {
    var chooser = $(name);
    chooser.unbind('change');
    chooser.change(function(evt) {
      var files = $('#fileDialogRight')[0].files;
      $('#right > .fileCounter > .counter').empty();
      for (var i = 0; i < files.length; ++i){
        //console.log(files[i].name);
          $('#right-file-pool > .files').append(`<p data-source="${files[i].path}">${files[i].name}</p>`);
          rightSoundsArray.push(files[i].path);
          //console.log(rightSoundsArray);
      }
      $('#right > .fileCounter > .counter').append(rightSoundsArray.length);
      if(leftSoundsArray.length == rightSoundsArray.length){
        $('#left > .fileCounter > .error').empty();
        $('#right > .fileCounter > .error').empty();
        setTimeout(function(){
          $('.main-content').slick('slickNext');
        }, 1000);
      } else if(leftSoundsArray.length < rightSoundsArray.length) {
        $('#left > .fileCounter .error').append('You need to add more files.');
      } else if(leftSoundsArray.length > rightSoundsArray.length) {
        $('#right > .fileCounter .error').append('You need to add more files.');
      }  
    });

    chooser.trigger('click');  
  }

function chooseDestFolder(){
  var chooser = $('#folder_dialog_input');
    chooser.unbind('change');
    chooser.change(function(evt) {
        folder_path = $(this).val();
        $(this).val('');
        //console.log(folder_path);
        $('#chosenPath').append(`Destination: ${folder_path}`);
        setTimeout(function(){
          $('.main-content').slick('slickNext');
        }, 1000);
    });
    chooser.trigger('click'); 
}

$('#mergeFiles').click(function(){
  var arrayLen = leftSoundsArray.length;
  var progVal = 100 / arrayLen;
  var totalVal = 0;
  for(var i = 0; i < leftSoundsArray.length; i++){
    var leftFileName = path.basename(leftSoundsArray[i]).replace(/\.[^/.]+$/, "");
    var rightFileName = path.basename(rightSoundsArray[i]).replace(/\.[^/.]+$/, "");
    var outputFileName = `${leftFileName}_${rightFileName}`;
    totalVal = totalVal + progVal;
    //console.log(totalVal);
    var stream;
    var newFile = fs.createWriteStream(`${folder_path}/${outputFileName}${i}.mp3`);
    $('#outputFiles').append(`<p>${folder_path}/${outputFileName}.mp3</p>`) 
    stream = fs.createReadStream(leftSoundsArray[i]);
    stream.pipe(newFile, {end: false});
    stream = fs.createReadStream(rightSoundsArray[i]);
    stream.pipe(newFile, {end: false});
    stream.on('end', function() {
        //console.log('added file', stream);
        $('.slide3content > progress').attr('value', totalVal);
    });
  } 
});
 