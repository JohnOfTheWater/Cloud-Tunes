'use strict';

module.exports = Song;

var songs = global.nss.db.collection('songs');
var fs = require('fs');
var path = require('path');
var Mongo = require('mongodb');
var _ = require('lodash');

function Song(song){
  this.title = rollo(song.title);
  this.artist = song.artist;
  this.album = pippo(song.album);
}

function rollo(x){
  x = x.toLowerCase();
  return x;
}

function pippo(x){
  x = x.replace(/\s/g, '-');
  return x;
}

Song.prototype.addMp3 = function(oldpath){
  console.log('old path', oldpath);
  var songTitle = this.title.replace(/\s/g, '').toLowerCase();
  var songArtist = this.artist.replace(/\s/g, '').toLowerCase();
  var abspath = __dirname + '/../static';
  var relpath = '/audios/';
  relpath += songArtist + '-' + songTitle;

  var extension = path.extname(oldpath);
  relpath += extension;
  fs.renameSync(oldpath, abspath + relpath);

  this.filepath = relpath;
};

Song.prototype.insert = function(fn){
  songs.insert(this, function(err, records){
    fn(err);
  });
};

/*
Album.prototype.update = function(fn){
  albums.update({_id:this._id}, this, function(err, count){
    fn(err, count);
  });
};
*/

Song.findByAlbum = function(album, fn){
  console.log('inside model: '+album);
  songs.find({album:album}).toArray(function(err, records){
    fn(records);
  });
};

Song.findByTitle = function(title, fn){
  console.log('inside model: '+title);
  songs.find({title:title}).toArray(function(err, record){
    fn(record);
  });
};

Song.findAll = function(fn){
  songs.find().toArray(function(err, records){
    fn(records);
  });
};

Song.findById = function(id, fn){
  var _id = Mongo.ObjectID(id);

  songs.findOne({_id:_id}, function(err, record){
    fn(_.extend(record, Song.prototype));
  });
};

Song.deleteById = function(id, fn){
  var _id = Mongo.ObjectID(id);

  songs.remove({_id:_id}, function(err, count){
    fn(count);
  });
};
