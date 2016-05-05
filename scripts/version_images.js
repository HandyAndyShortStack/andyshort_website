var watch = require('watch');
var gm = require('gm');
var fs = require('fs');

watch.watchTree('./images', function(f, curr, prev) {
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

function version(path) {
  console.log('versioning ' + path);
  var re = RegExp('\.[^\.]+$');
  var extention = path.match(re)[0];
  var buildPath = 'build/' + path;
  var smallPath = buildPath.replace(re, '') + '_small' + extention;
  fs.createReadStream(path).pipe(fs.createWriteStream(buildPath));
  gm(path).resize(600, 600).write(smallPath, function(err) {
    if (err) return console.log(err);
    console.log('finished versioning ' + path);
  });  
}
