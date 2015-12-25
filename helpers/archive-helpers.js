var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(cb){
  fs.readFile(exports.paths.list, function(error, data){
    if (error){
      console.error(error);
    } else {
      cb(data.toString().split('\n'));
    }
  });
};

exports.isUrlInList = function(url, cb){
  exports.readListOfUrls(function(data){
    var found = (_.contains(data, url));
    cb(found);
  });
};

exports.addUrlToList = function(url, cb){
  fs.appendFile(exports.paths.list, url + '\n', function(error){
    if(error){
      console.log('error', error);
    } else {
      cb();
    }
  });
};

exports.isUrlArchived = function(url, cb){
  fs.readdir(exports.paths.archivedSites, function(error, data){
    if (error){
      console.error(error);
    } else {
      var found = (_.contains(data, url));
      cb(found);
    }
  });
};

exports.downloadUrls = function(urls){
  _.each(urls, function(url){
    var file = exports.paths.archivedSites + '/' + url;
    if(!url){
      return;
    }
    request('http://' + url).pipe(fs.createWriteStream(file));
  });
};
