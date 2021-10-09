var fs = require('co-fs');
var path = require('path');
var views = require('co-views');
var origFs = require('fs');
var koaRouter = require('koa-router');
var mime = require('mime-types');

var Tools = require('./tools');
var FileManager = require('./fileManager');

var router = new koaRouter();
var render = views(path.join(__dirname, './views'), {map: {html: 'ejs'}});

router.get('/', function *() {
  this.redirect('/files/');
});

router.get('/files/', function *() {
  this.body = yield render('files');
});

router.get('/files/api/(.*)', Tools.loadRealPath, Tools.checkPathExists, function *() {
  var p = this.request.fPath;
  var stats = yield fs.stat(p);
  if (stats.isDirectory()) {
    this.body = yield * FileManager.list(p);
  }
  else {
    //this.body = yield fs.createReadStream(p);
    // C.logger.info(mime.lookup(p));
    this.type = mime.lookup(p);
    this.body = origFs.createReadStream(p);
  }
});

module.exports = router.middleware();
