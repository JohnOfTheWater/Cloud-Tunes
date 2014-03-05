(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
    $('#deletePanel').hide();
    $('#addPanel').hide();
    $('#searchPanel').hide();
    $('#closeSearch').click(hideSearchPanel);
    $('#searchButton').click(searchSong);
    $('#newArtist').click(addPanel);
    $('#delete').click(deletePanel);
    $('#deletePanel').on('click', '.title', deleteArtist);
    getArtists();
  }
//----------Global Variables-------------------/

  var actualId = '';
//----------Capitalize-------------------/

  function capitalize(x){
    return x.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase();});
  }

//----------Animation-------------------/

  function deletePanel(){
    $('#addPanel').hide();
    $('#deletePanel').fadeToggle('slow');
  }

  function addPanel(){
    $('#deletePanel').hide();
    $('#addPanel').fadeToggle('slow');
  }

  function hideSearchPanel(){
    $('#searchPanel').fadeOut();
  }

//-------Search Song------------------------------//
  function searchSong(){
    var title = $('#search').val();
    title = title.toLowerCase();
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

//-------delete Artist----------//

  function deleteArtist(){
    var id = $(this).data('id');
    var url = window.location.origin.replace(/[0-9]{4}/, '4000') + '/artists/' + id;
    var type = 'DELETE';
    actualId = id;
    var success = removeArtist;

    $.ajax({url:url, type:type, success:success});

  }

  function removeArtist(data){
    if(data.count === 1){
      $('.title[data-id="'+actualId+'"]').remove();
      $('.album[val="'+actualId+'"]').remove();
      actualId = '';
    }
  }



//----------getArtists-------------------/
  function getArtists(){
    var url = window.location.origin.replace(/[0-9]{4}/, '4000') + '/artistsList';
    $.getJSON(url, displayArtists);
  }

  function displayArtists(data){

    for(var i = 0; i < data.artists.length; i++){
      displayAlbum(data.artists[i]);
    }
  }

  function displayAlbum(album){
    //prioritiesArray.push(priority);
    var $title = $('<div>');
    //var $del = $('<div>');
    //var $edit = $('<div>');

    $title.text('-'+album.name).attr('data-id', album._id).addClass('title');
    //$del.text('x').addClass('delete').attr('data-id', album._id);
    //$edit.text('edit').addClass('edit').attr('data-id', priority._id).css('visibility', 'hidden');

    $('#title').append($title);
    //$('#del').append($del);
    //$('#edit').append($edit);
  }
//---------------------------------------//
})();

