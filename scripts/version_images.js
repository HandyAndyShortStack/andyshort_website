var watch = require('watch');
var gm = require('gm');
var fs = require('fs');

watch.watchTree('./images/in', function(f, curr, prev) {
  if (typeof f == "object" && prev === null && curr === null) {
      // Finished walking the tree
      return;
    } else if (prev === null) {
      // f is a new file
      version(f);
    } else if (curr.nlink === 0) {
      // f was removed
    } else {
      // f was changed
      version(f);
    }
});

function version(inPath) {
  var re = RegExp('\.[^\.]+$');
  var extention = inPath.match(re)[0];
  if (!extention) return; // inPath is a directory
  console.log('versioning ' + inPath);
  var outPath = inPath.replace(/^images\/in/, 'images/out');
  fs.createReadStream(inPath).pipe(fs.createWriteStream(outPath));
  var smallPath = outPath.replace(re, '') + '_small' + extention;
  gm(inPath).resize(600, 600).write(smallPath, function(err) {
    if (err) return console.log(err);
    console.log('finished versioning ' + inPath);
  });  
}
