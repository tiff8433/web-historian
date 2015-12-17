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

exports.readListOfUrls = function(callback){
//http://www.tutorialspoint.com/nodejs/nodejs_file_system.htm
  fs.readFile(exports.paths.list, function (err, data) {
     if (err) {
         return console.error(err);
     } else {
      callback(data.toString().split('\n'));
      //console.log("Asynchronous read: " + data.split('\n'));
     }
  });
};

exports.isUrlInList = function(url, callback){
  exports.readListOfUrls(function(data){
    var found = (_.contains(data, url));
      callback(found);
    });
};

exports.addUrlToList = function(url, callback){
  fs.appendFile(exports.paths.list, url, function (err) {
    if (err) {
      throw err;
    } else {
      callback();
    }
  });
};

exports.isUrlArchived = function(url, callback){
  fs.readdir(exports.paths.archivedSites, function (err, data) {
     if (err) {
         return console.error(err);
     } else {
      var found = (_.contains(data, url));
      callback(found);
     }
  });
};

exports.downloadUrls = function(urls){
  _.each(urls, function(url){
    var file = exports.paths.archivedSites + "/" + url;
    if(!url){
      return;
    }
    request('http://' + url).pipe(fs.createWriteStream(file));
  })
};





