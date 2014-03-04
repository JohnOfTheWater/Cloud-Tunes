(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
    $('#deletePanel').hide();
    $('#addPanel').hide();
    $('#newArtist').click(addPanel);
    $('#delete').click(deletePanel);
    $('#deletePanel').on('click', '.title', deleteArtist);
    getArtists();
  }
//----------Global Variables-------------------/

  var actualId = '';
//----------Animation-------------------/

  function deletePanel(){
    $('#addPanel').hide();
    $('#deletePanel').fadeToggle('slow');
  }

  function addPanel(){
    $('#deletePanel').hide();
    $('#addPanel').fadeToggle('slow');
  }

//-------Add Artist------------------------------//


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

