var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require ('./http-helpers');
var fs = require('fs');
var urlParser = require ('url');
// require more modules/folders here!

exports.handleRequest = function (request, response) {
  console.log('Serving ' + request.method + ' to path ' + request.url);
  //console.log(archive.readListOfUrls());
  var urlPath = request.url === '/' ? '/index.html' : request.url;
  if (request.method === 'GET'){
    helpers.serveAssets(response, urlPath);
  }
  if (request.method === 'POST'){
    exports.collectData(request);
  }
};

/*POST:
  capture the URL 
  find out if requested URL is in archive/sites
  if it is
    send back the data
  else
    add it to the file (add it to the queue to be scraped)
*/

exports.collectData = function(request, callback){
  var data = "";
  request.on('data', function(chunk){
    data += chunk;
  });
  request.on('end', function(){
    callback(data);
  });
};
