$(document).ready(function(){

  //variables
  var clientID = '?client_id=z2yjt6dgs59kua030e1m9pa1i9rifx';
  var streams_api = "https://api.twitch.tv/kraken/streams/";
  var channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
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
      'linkText':'',
    }

    //offline is currently running both ifs, fix this
    if(data.stream === null){
      console.log('stream is null');
      streamInfo.text = " is OFFLINE";
      streamInfo.status = "offline"
      streamInfo.name = channels[i];
      streamInfo.link = data._links.channel;
      streamInfo.linkText = '<a href="https://www.twitch.tv/'+streamInfo.name+'/videos/all">Go to channel</a>';
      streamInfo.logo = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/ProhibitionSign2.svg/1200px-ProhibitionSign2.svg.png";
      //run function to append row
      insertStream(streamInfo);
    }
    else if(data.stream._id){
      console.log('stream is live');
        streamInfo.name = channels[i];
        streamInfo.status="online";
        streamInfo.text = name  + " is currently playing " + data.stream.game;
        streamInfo.logo =  data.stream.channel.logo;
        streamInfo.linkText = '<a href="">Watch here</a>';
        streamInfo.link = data.stream._links.self;
        //run function to insert row
      insertStream(streamInfo);

    }
  }

  function insertStream(streamObj){
    var logoHTML = '<div class="col-xs-2"><img src="'+streamObj.logo+'" alt=""></div>';
    var streamHTML = '<div class="col-xs-3" class="streamName">'+ streamObj.name +'</div>';
    var textHTML =  '<div class="col-xs-5" class="streamText">'+ streamObj.text +'</div>';
    var linkHTML =  '<div class="col-xs-2" class="linkText">'+ streamObj.linkText +'</div>';
    var rowHTML = '<div class="row '+streamObj.status+'">'+logoHTML+streamHTML+textHTML+linkHTML+'</div>';
    $("#streamsContainer").append(rowHTML);
  };







});
