const fs = require('fs');


var folder_path = '';
var leftSoundsArray = [];
var rightSoundsArray = [];

function chooseDestFolder(){
  var chooser = $('#folder_dialog_input');
    chooser.unbind('change'); // Needed, otherwise the value will always be "" 
    chooser.change(function(evt) {
        folder_path = $(this).val();
        $(this).val(''); // Reset value of selected directory (so change event will *always* be triggered)
        console.log(folder_path);
    });
    chooser.trigger('click'); 
}

$('#mergeFiles').click(function(){
  for(var i = 0; i < leftSoundsArray.length; i++){
    var stream;
    //var soundPair = [];
    //soundPair = soundPair.push(leftSoundsArray[i]);
    //soundPair = soundPair.push(rightSoundsArray[i]);
    var newFile = fs.createWriteStream(`${folder_path}/newFile${i}.mp3`);
    stream = fs.createReadStream(leftSoundsArray[i]);
    stream.pipe(newFile, {end: false});
    stream = fs.createReadStream(rightSoundsArray[i]);
    stream.pipe(newFile, {end: false});
    stream.on('end', function() {
        console.log('added file', stream);  
    });
    //console.log('new file:', leftSoundsArray[i]+rightSoundsArray[i]);
    //
    //stream.pipe(dhh, {end: false});
  }
});

$('#chooseDest').click(function(){
  chooseDestFolder('#folder_dialog_input');
});

$('#left-trigger').click(function(){
  chooseFileLeft('#fileDialogLeft');
});

$('#right-trigger').click(function(){
  chooseFileRight('#fileDialogRight');
});

  function chooseFileLeft(name) {
    var chooser = $(name);
    chooser.unbind('change');
    chooser.change(function(evt) {
      var files = $('#fileDialogLeft')[0].files;
		for (var i = 0; i < files.length; ++i){
			console.log(files[i].name);
  			$('#left-file-pool').append(`<p data-source="${files[i].path}">${files[i].name}</p>`);
        leftSoundsArray.push(files[i].path);
        console.log(leftSoundsArray);
		}
    });

    chooser.trigger('click');  
  }

  function chooseFileRight(name) {
    var chooser = $(name);
    chooser.unbind('change');
    chooser.change(function(evt) {
      var files = $('#fileDialogRight')[0].files;
    for (var i = 0; i < files.length; ++i){
      console.log(files[i].name);
        $('#right-file-pool').append(`<p data-source="${files[i].path}">${files[i].name}</p>`);
        rightSoundsArray.push(files[i].path);
        console.log(rightSoundsArray);
    }
    });

    chooser.trigger('click');  
  }



// audio concat feature 
/*

var fs = require('fs'),
    files = fs.readdirSync('./files'),
    clips = [],
    stream,
    currentfile,
    dhh = fs.createWriteStream('./dhh-interview.mp3');

// create an array with filenames (time)
files.forEach(function (file) {
    clips.push(file.substring(0, 6));  
});

// Sort
clips.sort(function (a, b) {
    return a - b;
});


// recursive function
function main() {
    if (!clips.length) {
        dhh.end("Done");
        return;
    }
    
    currentfile = './files/' + clips.shift() + '.mp3';
    stream = fs.createReadStream(currentfile);
    
    stream.pipe(dhh, {end: false});
    
    stream.on("end", function() {
        console.log(currentfile + ' appended');
        main();        
    });
}


main();
*/


 