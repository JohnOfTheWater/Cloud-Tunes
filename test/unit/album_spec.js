'use strict';
process.env.DBNAME = 'album-test';
var expect = require('chai').expect;
//var Mongo = require('mongodb');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var Album;

before(function(done){
  var initMongo = require('../../app/lib/init-mongo');
  initMongo.db(function(){
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

describe('Album', function(){
  describe('new', function(){
    it('creates a new album object', function(){
      var o = {};
      o.title = 'Euro Vacation';
      o.taken = '2010-03-25';
      var a1 = new Album(o);
      expect(a1).to.be.instanceof(Album);
      expect(a1.title).to.equal('Euro Vacation');
      expect(a1.taken).to.be.instanceof(Date);
    });
  });

  describe('#addCover', function(){
    it('adds a cover to the album', function(){
      var o = {};
      o.title = 'Euro Vacation';
      o.taken = '2010-03-25';
      var a1 = new Album(o);
      var oldname = __dirname + '/../fixtures/euro-copy.jpg';
      a1.addCover(oldname);
      expect(a1.cover).to.equal(path.normalize(__dirname + '/../../app/static/img/eurovacation/cover.jpg'));
    });
  });

  describe('#insert', function(){
    it('saves an album to the database', function(done){
      var o = {};
      o.taken = '2010-03-25';
      o.title = 'Euro Vacation';
      var a1 = new Album(o);
      var oldname = __dirname + '/../fixtures/euro-copy.jpg';
      a1.addCover(oldname);
      a1.insert(function(){
        expect(a1._id.toString()).to.have.length(24);
        done();
      });
    });
  });

  describe('Find Methods', function(){
    beforeEach(function(done){
      var a1 = new Album({title:'A', taken:'2012-03-25'});
      var a2 = new Album({title:'B', taken:'2012-03-26'});
      var a3 = new Album({title:'C', taken:'2012-03-27'});

      a1.insert(function(){
        a2.insert(function(){
          a3.insert(function(){
            done();
          });
        });
      });
    });

    describe('.findAll', function(){
      it('should find all the albums in the database', function(done){
        Album.findAll(function(albums){
          expect(albums).to.have.length(3);
          done();
        });
      });
    });
  });

});

