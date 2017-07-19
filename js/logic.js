$(document).ready(function(){

  //variables
  var clientID = '?client_id=z2yjt6dgs59kua030e1m9pa1i9rifx';
  var streams_api = "https://api.twitch.tv/kraken/streams/";
  var channels = ["ESL_SC2", "OgamingSC2", "cretetion" ];
  var streamCount = 3;
  var rows = 1;

  createRows();

  //run ajax call for each channel
  channels.forEach(function(x,i){
    console.log(streams_api+x+clientID);
    $.ajax({
      url: streams_api+x+clientID,
      dataType: "json",
      data: {
        format: "json",
      },
      success: function(data){
        fetchData(data, i, x);

      },
      error: function(){
        console.log("Couldn't access JSON");

      }
    });
  });

  function fetchData(data, i, name){

    var streamInfo = {
      'logo':'',
      'text':'',
      'name:':'',
      'link':'',
      'status':'',
      'linkText':'',
    }

    //offline is currently running both ifs, fix this
    if(data.stream === null){
      streamInfo.text = " is OFFLINE";
      streamInfo.status = "offline"
      streamInfo.name = name;
      streamInfo.link = data._links.channel;
      streamInfo.linkText = '<a href="https://www.twitch.tv/'+streamInfo.name+'/videos/all" target="blank">Go to channel</a>';
      streamInfo.logo = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/ProhibitionSign2.svg/1200px-ProhibitionSign2.svg.png";
      insertStream(streamInfo,i);
    }
    else if(data.stream._id){
        streamInfo.name = name;
        streamInfo.status="online";
        streamInfo.text = " is currently playing " + data.stream.game;
        streamInfo.logo =  data.stream.channel.logo;
        streamInfo.linkText = '<a href="https://www.twitch.tv/'+streamInfo.name+'" target="blank">Watch here</a>';
        streamInfo.link = data.stream._links.self;
        insertStream(streamInfo,i);
    }

  }

  function createRows() {
    console.log('creating row');
    var count = channels.length;
    var reqRows = Math.ceil(count/3);
    var rowsArr = [];
    for(i=1;i<=reqRows;i++){
      rowsArr.push(i);
    }
    rowsArr.forEach(function(rowNum){
      var rowHTML = '<div class="row row'+rowNum+'"></div>';
      $("#streamsContainer").append(rowHTML);
    });
  }

/// TODO: Need to work out overflow, or concats for long names
  function insertStream(streamObj, index){
    console.log('inserting stream');
    var logoHTML = '<img src="'+streamObj.logo+'" alt="">';
    var streamHTML = '<p class="streamName">'+ streamObj.name +'</p>';
    var textHTML =  '<p class="streamText">'+ streamObj.text +'</p>';
    var linkHTML =  '<p class="linkText">'+ streamObj.linkText +'</p>';
    var tileHTML = '<div class="streamerTile col-xs-12 col-md-4"'+streamObj.status+'>'+streamHTML+logoHTML+textHTML+linkHTML+'</div>';
    var rowPos = 1;
    if(Math.ceil(index/3)>1){
      rowPos = Math.ceil(index/3);
    }
    $(".row"+rowPos).append(tileHTML);
  };

  //add stream input bar functions
  $('#search-btn').click(function(){
    var searchText = $('#search-stream').val();
    if(searchText.length == 0){
      $('#search-stream').attr('placeholder','Please enter a streamer');
    }
    else{
      channels.push(searchText);
      $.ajax({
        url: streams_api+searchText+clientID,
        dataType: "json",
        data: {
          format: "json",
        },
        success: function(data){
          if((streamCount-1)%3 === 0){
            console.log('time for a new row');
            var newRow = Math.ceil((streamCount+1)/3);
            var rowHTML = '<div class="row row'+newRow+'"></div>';
            $("#streamsContainer").append(rowHTML);
          }
          console.log('about to fetch data');
          fetchData(data, channels.length, searchText);
        },
        error: function(){
          console.log("Couldn't access JSON");
        }
      });
      streamCount = channels.length;
      console.log(streamCount);
    }
    $('#search-stream').val('');

  })

  //online only and all button functions
  $('#show_online').click(function(){
    $('.offline').addClass('hidden');
  })

  $("#show_all").click(function(){
    console.log('show all');
    $('.row').removeClass('hidden');
  })
});
