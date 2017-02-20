const path = require('path');
const fs = require('fs-extra');
const CombinedStream = require('combined-stream');

//var readStream = fs.createReadStream('/Users/vagoa/Documents/development/audio-merge/test/ChinaDoll.mp3');
//var concatStream = concat(gotMusic);


var combinedStream = CombinedStream.create();
combinedStream.append(fs.createReadStream('/Users/vagoa/Documents/development/audio-merge/test/ChinaDoll.mp3'));
//combinedStream.append(fs.createReadStream('file2.txt'));
combinedStream.append(fs.createReadStream('/Users/vagoa/Documents/development/audio-merge/test/LostEuropean.mp3'));

combinedStream.pipe(fs.createWriteStream('/Users/vagoa/Documents/development/audio-merge/test/test.mp3'));
