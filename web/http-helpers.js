var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var http = require('http');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)

    //looking in the public folder:
    fs.readFile(archive.paths.siteAssets + asset, {encoding: 'utf8'}, function (err,data) {
      if (err) {
        //looking in the archive folder
        fs.readFile(archive.paths.archivedSites + asset, {encoding: 'utf8'}, function (err,data) {
          if (err){
            exports.send404(res);
          } else {
            exports.sendResponse(res, data);
          }
        });
      } else {
        exports.sendResponse(res, data)
      }
    });
};

exports.sendResponse = function(res, obj, status) {
  status= status || 200;
  res.writeHead(status, headers);
  res.end(obj);
};

exports.send404 = function(res) {
  exports.sendResponse(res, 'file not found', 404);
};

exports.sendRedirect = function(res, location, status){
  status = status || 302;
  res.writeHead(status, {Location: location});
  res.end();
};

