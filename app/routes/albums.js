'use strict';

var Album = require('../models/album');
var moment = require('moment');

exports.index = function(req, res){
  Album.findAll(function(albums){
    res.render('albums/index', {moment:moment, albums:albums, title: 'Cloud-Tunes'});
  });
};

exports.list = function(req, res){
  console.log('inside routes: '+req.params.name);
  Album.findByArtist(req.params.name, function(albums){
    res.send({albums:albums});
  });
};
/*
exports.show = function(req, res){
  Album.findById(req.params.id, function(album){
    res.render('albums/show', {moment:moment, album:album, title: album.title});
  });
};
*/

exports.search = function(req, res){
  Album.findByTitle(req.params.title, function(album){
    res.res({album:album});
  });
};

exports.new = function(req, res){
  res.render('albums/new', {title: 'New Album'});
};

exports.create = function(req, res){
  var album = new Album(req.body);
  console.log('inside routes: '+req.files.cover.path);
  album.addCover(req.files.cover.path);
  album.insert(function(){
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
  Album.deleteById(req.params.id, function(count){
    res.send({count:count});
  });
};

