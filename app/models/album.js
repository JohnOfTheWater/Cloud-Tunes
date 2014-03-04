'use strict';

module.exports = Album;

var albums = global.nss.db.collection('albums');
var fs = require('fs');
var path = require('path');
var Mongo = require('mongodb');
var _ = require('lodash');

function Album(album){
  this.title = album.title;
  this.artist = album.artist;
  this.releaseyear = new Date(album.releaseyear);
  this.songs = [];
}

Album.prototype.addCover = function(oldpath){
  var albumTitle = this.title.replace(/\s/g, '').toLowerCase();
  var albumArtist = this.artist.replace(/\s/g, '').toLowerCase();
  var abspath = __dirname + '/../static';
  var relpath = '/img/' + albumArtist + '-' + albumTitle;

  var extension = path.extname(oldpath);
  relpath += extension;
  fs.renameSync(oldpath, abspath + relpath);

  this.cover = relpath;
};

Album.prototype.addSong = function(songId, fn){
  var mongosongId = Mongo.ObjectID(songId);
  this.songs.push(mongosongId);
  this.update(function(count){
    fn(count);
  });
};

Album.prototype.insert = function(fn){
  albums.insert(this, function(err, records){
    fn(err);
  });
};

Album.prototype.update = function(fn){
  albums.update({_id:this._id}, this, function(err, count){
    fn(err, count);
  });
};

Album.findAll = function(fn){
  albums.find().toArray(function(err, records){
    fn(records);
  });
};

Album.findById = function(id, fn){
  var _id = Mongo.ObjectID(id);

  albums.findOne({_id:_id}, function(err, record){
    // extend (lodash method) sets the protoype of the object mongo returns
    fn(_.extend(record, Album.prototype));
  });
};

Album.findByArtist = function(name, fn){
  console.log('inside model: '+ name);
  albums.find({artist:name}).toArray(function(err, records){
    fn(records);
  });
};

Album.findByTitle = function(title, fn){
  console.log('inside model: '+ title);
  albums.find({title:title}).toArray(function(err, record){
    fn(record);
  });
};

Album.deleteById = function(id, fn){
  var _id = Mongo.ObjectID(id);
  albums.remove({_id:_id}, function(err, count){
    fn(count);
  });
};
