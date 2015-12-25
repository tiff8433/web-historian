var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, callback) {
  fs.readFile(archive.paths.siteAssets + asset, {encoding: 'utf8'}, function(error, data){
    if (error) {
      fs.readFile(archive.paths.archivedSites + asset, {encoding: 'utf8'}, function(error, data){
        if (error){
          exports.sendResponse(res, 'file not found', 404);
        } else {
          exports.sendResponse(res, data);
        }
      });
    } else {
      exports.sendResponse(res, data);
    }
  });
};

exports.sendResponse = function(res, obj, status){
  status = status || 200;
  res.writeHead(status, headers);
  res.end(obj);
}

exports.collectData = function(req, cb){
  var data = '';
  req.on('data', function(chunk){
    data += chunk;
  });
  req.on('end', function(){
    cb(data);
  });
}

exports.sendRedirect = function(res, location, status){
  var status = status || 302;
  res.writeHead(status, {Location: location});
  res.end();
}
