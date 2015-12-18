var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require ('./http-helpers');
var fs = require('fs');
var url = require ('url');
// require more modules/folders here!

exports.handleRequest = function (request, response) {
  //console.log('Serving ' + request.method + ' to path ' + request.url);
  //console.log(archive.readListOfUrls());
  var urlPath = request.url === '/' ? '/index.html' : request.url;
  if (request.method === 'GET'){
    helpers.serveAssets(response, urlPath);
  }
  if (request.method === 'POST'){
    //collect the data
    exports.collectData(request, function(data){
      console.log('data - line 18', data);
     var urlTemp = data.split('=')[1];
     //var urlTemp2 = JSON.parse(data).url.replace('http://', '');
      console.log("it goes into POST:" + urlTemp);
    //is it in our sites.txt
      archive.isUrlInList(urlTemp, function(found){
        if (found){
          archive.isUrlArchived(urlTemp, function(exists){
            if (exists){
              helpers.sendRedirect(response, '/' + urlTemp);
            } else {
              console.log('line27')
              helpers.sendRedirect(response, '/loading.html');
            }
          })
        } else {
        //append to sites.txt
        console.log('line33')
        archive.addUrlToList(urlTemp, function(){
           console.log('data', data);
           console.log('urlTemp', urlTemp);
          // console.log('urlTemp2', urlTemp2);

          helpers.sendRedirect(response, '/loading.html');  
        });
      }
    });
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
