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
    //collect the data
    exports.collectData(request, function(data){
      var url = JSON.parse(data).url.replace('http://', '');
      //var url = urlTemp.split('=')[1];
    //is it in our sites.txt
      if(archive.isUrlInList(url, function(found){
        if (found){
          archive.isUrlArchived(url, function(exists){
            if (exists){
              helpers.sendRedirect(response, '/' + url);
            } else {
              helpers.sendRedirect(response, '/loading.html');
            }
          });
        } else {
        //append to sites.txt
        archive.addUrlToList(url, function(){
          helpers.sendRedirect(response, '/loading.html');
        });
      }
    }));
  });
  }
};

exports.collectData = function(request, callback){
  var data = "";
  request.on('data', function(chunk){
    data += chunk;
  });
  request.on('end', function(){
    callback(data);
  });
};
