

function fileMergePairs(temp, folder, mergedFile){
	var fs = require('fs'),
    files = fs.readdirSync(folder),
    clips = [],
    stream,
    currentfile,
    dhh = fs.createWriteStream(`${temp}/${mergedFile}.mp3`);

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
	    
	    currentfile = folder+'/'+clips.shift();
	    stream = fs.createReadStream(currentfile);
	    
	    stream.pipe(dhh, {end: false});
	    
	    stream.on("end", function() {
	        //fs.unlinkSync(currentfile);
	        main();        
	    });
	}


	main();
}

//testMergePairs();
module.exports = { fileMergePairs };


