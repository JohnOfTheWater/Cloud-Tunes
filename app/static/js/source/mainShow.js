(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
    $('#deletePanel').hide();
    $('#addPanel').hide();
    $('#songPanel').hide();
    $('#searchPanel').hide();
    $('#close').click(hideSongPanel);
    $('#closeSearch').click(hideSearchPanel);
    $('#delete').click(deletePanel);
    $('#delSong').click(showDelete);
    $('#searchButton').click(searchSong);
    $('#deletePanel').on('click', '.title', deleteAlbum);
    $('#albumsList').on('click', '.albumCover', showSongPanel);
    $('#songPanel').on('click', '.delete', deleteSong);
    $('#searchPanel').on('click', '.albumSearch', redirectToSongList);
    getAlbums();
  }
//----------Global Variables-------------------/

  var actualId = '';
  var actualAlbum = '';
//----------Capitalize-----------------------/

  function capitalize(x){
    return x.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase();});
  }

//----------Animation-------------------/

  function deletePanel(){
    $('#songPanel').hide();
    $('#searchPanel').hide();
    $('#deletePanel').fadeToggle('slow');
  }

  function showSongPanel(){
    $('#songPanel').fadeIn('slow');
    $('#deletePanel').hide();
    $('#searchPanel').hide();
    actualAlbum = $(this).data('id');
    $('.songTitle').remove();
    $('.songAlbum').remove();
    getSongs();
  }

  function hideSongPanel(){
    $('#songPanel').fadeOut();
  }

  function hideSearchPanel(){
    $('#searchPanel').fadeOut();
  }
//----------RedirectToSongList-----------------//

  function redirectToSongList(){
    debugger;
    var album = $(this).data('id');
    actualAlbum = album;
    getSongs();
  }

//----------Search Song-----------------//

  function searchSong(){
    var title = $('#search').val();
    title = title.toLowerCase();
    console.log(title);
    var url = window.location.origin.replace(/[0-9]{4}/, '4000') + '/songsearch/' + title;
    $.getJSON(url, displaySearch);
  }

  function displaySearch(data){
    $('#songPanel').hide();
    $('.songTitleSearch').remove();
    $('#searchPanel').fadeIn('slow');
    var $songTitle = $('<div>');
    var $album = $('<div>');
    var $artist = $('<div>');
    var album = data.song[0].album;
    album = album.replace(/-/g, ' ');
    var songTitle = capitalize(data.song[0].title);

    $songTitle.text('SONG: '+songTitle).addClass('songTitleSearch').attr('data-id', data.song[0]._id);
    $album.text('ALBUM: '+album).addClass('albumSearch').attr('data-id', album);
    $artist.text('ARTIST: '+data.song[0].artist).addClass('artistSearch').attr('data-id', data.song[0]._id);

    $songTitle.append($artist);
    $artist.append($album);
    $('#searchPanel').append($songTitle);

  }
/*
  function findAlbum(title){
    debugger;
    var url = window.location.origin.replace(/[0-9]{4}/, '4000') + '/xxx/' + title;
    $.getJSON(url, displayAlbumCover);
  }

  function displayAlbumCover(data){
    console.log(data);
  }
*/
//----------Delete Song-----------------//

  function showDelete(){
    $('.delete').fadeToggle();
  }

  function deleteSong(){
    var id = $(this).data('id');
    var url = window.location.origin.replace(/[0-9]{4}/, '4000') + '/songs/' + id;
    var type = 'DELETE';
    actualId = id;
    var success = removeSong;

    $.ajax({url:url, type:type, success:success});

  }

  function removeSong(data){
    if(data.count === 1){
      $('.songTitle[data-id="'+actualId+'"]').remove();
      $('.delete').fadeOut();
      actualId = '';
    }
  }

//-------Get Songs by Album------------------------------//

  function getSongs(){
    $('#songPanel').fadeIn('slow');
    $('#deletePanel').hide();
    $('#searchPanel').hide();
    $('.songTitle').remove();
    $('.songAlbum').remove();
    var album = actualAlbum;
    console.log(album);
    album = album.replace(/\s/g, '-');
    var url = window.location.origin.replace(/[0-9]{4}/, '4000') + '/songslist/' + album;
    $.getJSON(url, displaySongs);
  }

  function displaySongs(data){
    var $album = $('<div>');
    var album = data.songs[0].album;
    album = album.replace(/-/g, ' ');
    $album.text(album).addClass('songAlbum').attr('data-id', data.songs[0]._id);
    $('#album').append($album);

    for(var i = 0; i < data.songs.length; i++){
      displaySong(data.songs[i], i);
    }
  }

  function displaySong(song, i){
    var $songTitle = $('<div>');
    var $x = $('<div>');
    var songTitle = capitalize(song.title);

    $songTitle.text((i+1)+'-'+songTitle).addClass('songTitle').attr('data-id', song._id);
    $x.text('[X]').addClass('delete').attr('data-id', song._id).hide();

    $songTitle.prepend($x);
    $('#songList').append($songTitle);

  }

//-------delete Album----------//

  function deleteAlbum(){
    var id = $(this).data('id');
    var url = window.location.origin.replace(/[0-9]{4}/, '4000') + '/albums/' + id;
    var type = 'DELETE';
    actualId = id;
    var success = removeAlbum;

    $.ajax({url:url, type:type, success:success});

  }

  function removeAlbum(data){
    if(data.count === 1){
      $('.title[data-id="'+actualId+'"]').remove();
      $('.album[val="'+actualId+'"]').remove();
      actualId = '';
    }
  }



//----------getAlbums-------------------/
  function getAlbums(){
    var name = $('h1').text();
    console.log(name);
    var url = window.location.origin.replace(/[0-9]{4}/, '4000') + '/albumslist/' + name;
    $.getJSON(url, displayAlbums);
  }

  function displayAlbums(data){
    for(var i = 0; i < data.albums.length; i++){
      displayAlbum(data.albums[i]);
    }
  }

  function displayAlbum(album){
    //prioritiesArray.push(priority);
//--------On Page Album List------------------------//

    var $albumTitle = $('<div>');
    var $cover = $('<div>');
    var $release = $('<div>');
    var release = album.releaseyear.slice(0, 10);

    $albumTitle.text(album.title).addClass('albumTitle').attr('data-id', album._id);
    $cover.css({'background': 'url('+album.cover+')', 'background-size': 'cover'}).addClass('albumCover').attr('data-id', album.title);
    $release.text(release).addClass('year').attr('data-id', album._id);

    $($albumTitle).append($release);
    $($cover).append($albumTitle);
    $('#albumsList').append($cover);

//--------Delete Album List------------------------//
    var $title = $('<div>');

    $title.text('-'+album.title).attr('data-id', album._id).addClass('title');

    $('#title').append($title);
  }
//---------------------------------------//
})();

