'use strict';

//var Album = require('../models/album');
var Song = require('../models/song');
//var moment = require('moment');
/*
exports.index = function(req, res){
  Album.findAll(function(albums){
    res.render('albums/index', {moment:moment, albums:albums, title: 'Cloud-Tunes'});
  });
};
*/
exports.list = function(req, res){
  console.log('inside routes before regEx: '+req.params.album);
  Song.findByAlbum(req.params.album, function(songs){
    res.send({songs:songs});
  });
};

exports.search = function(req, res){
  Song.findByTitle(req.params.title, function(song){
    res.send({song:song});
  });
};

exports.new = function(req, res){
  res.render('songs/new', {title: 'New Song'});
};

exports.create = function(req, res){
  var song = new Song(req.body);
  console.log('inside routes songs: '+req.body);
  //song.addMp3(req.files.cover.path);
  song.insert(function(){
    res.redirect('/');
  });
};

exports.redirect = function(req, res){
  res.redirect('/artists/'+req.params.artist+'');
};
/*
exports.photoAdd = function(req, res){
  Album.findById(req.params.id, function(album){
    album.addPhoto(req.files.photo.path, req.files.photo.name);
    album.update(function(){
      res.redirect('/albums/' + req.params.id);
    });
  });
};
*/
exports.destroy = function(req, res){
  Song.deleteById(req.params.id, function(count){
    res.send({count:count});
  });
};

