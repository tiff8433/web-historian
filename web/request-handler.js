var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require ('./http-helpers');
var fs = require('fs');
var urlParser = require ('url');
// require more modules/folders here!

exports.handleRequest = function (request, response) {
  console.log('Serving ' + request.method + ' to path ' + request.url);
 // var paths = urlParser.parse(request.url);
  var urlPath = request.url === '/' ? '/index.html' : request.url;

  if (request.method === 'GET'){
    helpers.serveAssets(response, urlPath);
  }
};
