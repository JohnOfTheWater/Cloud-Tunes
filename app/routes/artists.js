'use strict';

var Artist = require('../models/artist');
//var Album = require('../models/album');
var moment = require('moment');

exports.index = function(req, res){
  Artist.findAll(function(artists){
    res.render('artists/index', {moment:moment, artists:artists, title: 'Cloud-Tunes'});
  });
};

exports.list = function(req, res){
  Artist.findAll(function(artists){
    res.send({artists:artists});
  });
};

exports.show = function(req, res){
  Artist.findByName(req.params.name, function(artist){
    res.render('artists/show', {moment:moment, artist:artist, title: artist.name});
  });
  //Album.findByArtist(req.params.name, function(albums){
    //res.render('artists/show', {moment:moment, albums:albums});
  //});
};

exports.new = function(req, res){
  res.render('artists/new', {title: 'New Artist'});
};

exports.create = function(req, res){
  var artist = new Artist(req.body);
  artist.addPhoto(req.files.photo.path);
  artist.insert(function(){
    res.redirect('/');
  });
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
  Artist.deleteById(req.params.id, function(count){
    res.send({count:count});
  });
};

