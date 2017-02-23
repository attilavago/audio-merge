//const fs = require('fs');
const path = require('path');
const fs = require('fs-extra');
const ffmpeg = require('ffmpeg');
const Audioconcat = require('audioconcat');
const mkdirp = require('mkdirp');
const {testMergePairs} = require('./test.js');
var tempDir = '/Users/attilavago/documents/sites/development/audio-merge/test';
    
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
        // copy files to selected directory
    });
    chooser.trigger('click'); 
}




var copyLeft = function(i){
  var promise = new Promise(function(resolve, reject){
    leftSoundsArray;
    var leftFileName = path.basename(leftSoundsArray[i]).replace(/\.[^/.]+$/, "");
    var leftStream;
    var leftCopy = fs.createWriteStream(`${folder_path}/${leftFileName}.mp3`);
    leftStream = fs.createReadStream(leftSoundsArray[i]);
    leftStream.pipe(leftCopy);
    leftStream.on('end', function() {
      console.log('left');
      resolve(i);
    });
  });
  return promise;
}

var copyRight = function(i){
  var promise = new Promise(function(resolve, reject){
    rightSoundsArray;
    var rightFileName = path.basename(rightSoundsArray[i]).replace(/\.[^/.]+$/, "");
    var rightStream;
    var rightCopy = fs.createWriteStream(`${folder_path}/${rightFileName}.mp3`);
    rightStream = fs.createReadStream(rightSoundsArray[i]);
    rightStream.pipe(rightCopy);
    rightStream.on('end', function() {
      console.log('right');
      resolve(i);
    });
  });
  return promise;
}

var merge = function(i){
  var promise = new Promise(function(resolve, reject){
    folder_path;
    testMergePairs(folder_path);
    /*
    const spawn = require('child_process').spawn;
    const child = spawn(process.argv[0], ['test.js'], {
      detached: true,
      stdio: 'ignore'
    });
    child.unref();
    */
  });
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
    copyLeft(i)
      .then(copyRight)
      .then(merge);
    $('#outputFiles').append(`<p>${folder_path}/${outputFileName}.mp3</p>`); 
    /*
    stream = fs.createReadStream(leftSoundsArray[i]);
    stream.pipe(newFile, {end: false, highWaterMark: 10000});
    stream = fs.createReadStream(rightSoundsArray[i]);
    stream.pipe(newFile, {end: false, highWaterMark: 10000});
    stream.on('end', function() {
        //console.log('added file', stream);
        $('.slide3content > progress').attr('value', totalVal);
    });
    */
    //$('#outputFiles').append(`<p>${folder_path}/${outputFileName}.mp3</p>`) 
    //$('.slide3content > progress').attr('value', totalVal);
    
  } 
});

$('#test').on('click',function(){
  fs.unlink(`${tempDir}/.DS_Store`, function(){
    
  const spawn = require('child_process').spawn;

const child = spawn(process.argv[0], ['test.js'], {
  detached: true,
  stdio: 'ignore'
});

child.unref();

});
});
 








 