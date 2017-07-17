$(document).ready(function(){

  //variables
  var clientID = '?client_id=z2yjt6dgs59kua030e1m9pa1i9rifx';
  var streams_api = "https://api.twitch.tv/kraken/streams/";
  var channels = ["ESL_SC2", "OgamingSC2", "Killingbird"];
  var streamData = [];
  var streamCount = 3;
  var rows = 1;

  //store JSON data for each channel
  channels.forEach(function(x,i){
    console.log(streams_api+x+clientID);
    $.ajax({
      url: streams_api+x+clientID,
      dataType: "json",
      data: {
        format: "json",
      },
      success: function(data){
        fetchData(data, i);
      },
      error: function(){
        console.log("Couldn't access JSON");
      }
    });
  });

  function fetchData(data, i){

    var streamInfo = {
      'logo':'',
      'text':'',
      'name:':'',
      'link':'',
      'status':'',
    }
    if(data.stream === null){

      streamInfo.text = " is OFFLINE";
      streamInfo.status = "offline"
      streamInfo.name = channels[i];
      streamInfo.link = data._links.channel;
      streamInfo.logo = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/ProhibitionSign2.svg/1200px-ProhibitionSign2.svg.png";
      //run function to append row
      insertStream(streamInfo);
    }
    else if(data.stream._id){
        streamInfo.name = channels[i];
        streamInfo.status="online";
        streamInfo.text = name  + " is currently playing " + data.stream.game;
        streamInfo.logo =  data.stream.channel.logo;
        streamInfo.link = data.stream._links.self;
        //run function to insert row
      insertStream(streamInfo);

    }
  }

  function insertStream(streamObj){
    var rowHTML = '<div class="row '+streamObj.status+'"><img src="'+streamObj.logo+'" alt=""><span class= "streamName">'+streamObj.name+'</span><span class="streamText">'+streamObj.text+'</span></div>';
    $("#streamsContainer").append(rowHTML);
  };





});
