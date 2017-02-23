/*
var FfmpegCommand = require('fluent-ffmpeg');
var command = new FfmpegCommand();

var proc = ffmpeg('/Users/attilavago/documents/sites/development/audio-merge/test/ss_economics_sp_accion.wav')
    .input('/Users/attilavago/documents/sites/development/audio-merge/test/ss_econ_glossary_absolute_advantage.wav')
    //.input(fourthFile)
    //.input(...)
    .on('end', function() {
      console.log('files have been merged succesfully');
    })
    .on('error', function(err) {
      console.log('an error happened: ' + err.message);
    })
    .mergeToFile('/Users/attilavago/documents/sites/development/audio-merge/test/test.wav');
*/

function testMergePairs(folder){
	var fs = require('fs'),
    files = fs.readdirSync(folder),
    clips = [],
    stream,
    currentfile,
    dhh = fs.createWriteStream(folder+'/dhh-interview.mp3');

	// create an array with filenames (time)

	files.forEach(function (file) {
	    clips.push(file);  
	});

	console.log(clips);


	// recursive function
	function main() {
	    if (!clips.length) {
	        dhh.end("Done");
	        return;
	    }
	    
	    currentfile = '/Users/attilavago/documents/sites/development/audio-merge/test/'+clips.shift();
	    stream = fs.createReadStream(currentfile);
	    
	    stream.pipe(dhh, {end: false});
	    
	    stream.on("end", function() {
	        console.log(currentfile + ' appended');
	        main();        
	    });
	}


	main();
}

//testMergePairs();
module.exports = { testMergePairs };


