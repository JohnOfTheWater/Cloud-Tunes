/* jshint expr:true */

'use strict';

process.env.DBNAME = 'album-test';
var app = require('../../app/app');
var request = require('supertest');
//var expect = require('chai').expect;
var fs = require('fs');
//var path = require('path');
var rimraf = require('rimraf');
var Album;

describe('albums', function(){

  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      Album = require('../../app/models/album');
      done();
    });
  });

  beforeEach(function(done){
    var imgdir = __dirname + '/../../app/static/img';
    rimraf.sync(imgdir);
    fs.mkdirSync(imgdir);
    var origfile = __dirname + '/../fixtures/euro.jpg';
    var copyfile = __dirname + '/../fixtures/euro-copy.jpg';
    fs.createReadStream(origfile).pipe(fs.createWriteStream(copyfile));

    global.nss.db.dropDatabase(function(err, result){
      done();
    });
  });

  describe('GET /albums/new', function(){
    it('display the new album html page', function(done){
      request(app)
      .get('/albums/new')
      .expect(200, done);
    });
  });

  describe('POST /albums', function(){
    it('creates a new album and redirects back to the home page', function(done){
      var filename = __dirname + '/../fixtures/euro-copy.jpg';

      request(app)
      .post('/albums')
      .attach('cover', filename)
      .field('title', 'European Vacation')
      .field('taken', '2014-02-25')
      .expect(302, done);
    });
  });

});
