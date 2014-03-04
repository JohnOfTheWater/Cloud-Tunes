'use strict';

var d = require('../lib/request-debug');
var initialized = false;

module.exports = function(req, res, next){
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var albums = require('../routes/albums');
  var artists = require('../routes/artists');
  var songs = require('../routes/songs');

  //app.get('/', d, albums.index);
  app.get('/albumslist/:name', d, albums.list);
  app.get('/xxx/:title', d, albums.search);
  app.get('/', d, artists.index);
  app.get('/artists/new', d, artists.new);
  app.post('/artists', d, artists.create);
  app.get('/artistsList', d, artists.list);
  app.del('/artists/:id', d, artists.destroy);
  app.get('/artists/:name', d, artists.show);
  app.get('/albums/new', d, albums.new);
  //app.get('/albums/:id', d, albums.show);
  app.post('/albums', d, albums.create);
  //app.post('/albums/:id', d, albums.photoAdd);
  app.get('/songslist/:album', d, songs.list);
  app.get('/songs', d, songs.new);
  app.post('/songs', d, songs.create);
  app.del('/songs/:id', d, songs.destroy);
  app.get('/songsearch/:title', d, songs.search);
  //app.get('/redirect/:artist', d, songs.redirect);
  app.del('/albums/:id', d, albums.destroy);
  console.log('Routes Loaded');
  fn();
}

