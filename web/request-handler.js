var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers.js');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  var urlPath = req.url === '/' ? '/index.html' : req.url;
  if (req.method === 'GET'){
    helpers.serveAssets(res, urlPath);
  };
  if (req.method === 'POST') {
    helpers.collectData(req, function(data){

      var urlPath = data.split('=')[1];
      console.log('urlPath', urlPath);
      
      archive.isUrlInList(urlPath, function(found){
        if (found){
          archive.isUrlArchived(urlPath, function(found){
            if(found) {
              helpers.sendRedirect(res, '/' + urlPath);
            } else {
              helpers.sendRedirect(res, '/loading.html');
            }
          });
        } else {
          archive.addUrlToList(urlPath, function(){
            helpers.sendRedirect(res, '/loading.html');
          });
        }
      });
    });
  }
};
