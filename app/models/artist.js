'use strict';

module.exports = Artist;

var artists = global.nss.db.collection('artists');
var fs = require('fs');
var path = require('path');
var mongo = require('mongodb');
//var _ = require('lodash');

function Artist(artist){
  this.name = artist.name;
  this.albums = artist.albums || [];
  this.photo = artist.photo;
}

Artist.prototype.addPhoto = function(oldname){
  var dirname = this.name.replace(/\s/g, '').toLowerCase();
  var abspath = __dirname + '/../static';
  var relpath = '/img/' + dirname;
  fs.mkdirSync(abspath + relpath);

  var extension = path.extname(oldname);
  relpath += '/photo' + extension;
  fs.renameSync(oldname, abspath + relpath);

  this.photo = relpath;
};

//albumId = string
Artist.prototype.addAlbum = function(albumId){
  this.albums.push(albumId);
};

Artist.prototype.insert = function(fn){
  artists.insert(this, function(err, record){
    fn(err);
  });
};

/* Find Methods */

Artist.findById = function(id, fn){
  var _id = mongo.ObjectID(id);
  artists.findOne({_id:_id}, function(err, record){
    console.log(err);
    fn(record);
  });
};

Artist.findByName = function(name, fn){
  artists.findOne({name:name}, function(err, record){
    fn(record);
  });
};

Artist.findAll = function(fn){
  artists.find().toArray(function(err, records){
    fn(records);
  });
};

Artist.deleteById = function(id, fn){
  var _id = mongo.ObjectID(id);
  artists.remove({_id:_id}, function(err, count){
    fn(count);
  });
};
