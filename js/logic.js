$(document).ready(function(){

  //variables
  var clientID = '?client_id=z2yjt6dgs59kua030e1m9pa1i9rifx';
  var streams_api = "https://api.twitch.tv/kraken/streams/";
  var channels = ["ESL_SC2",  "cretetion","freecodecamp", "habathcx","OgamingSC2", "RobotCaleb", "noobs2ninjas" ];
  var streamData = [];
  var streamCount = 3;

console.log(channels);

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
console.log(streamData)


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
      //check for real channel here
      $.ajax({
        url: data._links.channel+clientID,
        dataType: "json",
        data: {
          format: "json",
        },
        success: function(data){
         //what to do here to split offline real users and fake users
          getChannel(data,i);
        },
        error: function(){
          console.log("Couldn't access JSON in check channel");
          errorMessage();
        }
      });

        }


    if(data.stream._id){
        streamInfo.name = name;
        streamInfo.status="online";
        streamInfo.text = " is currently playing " + data.stream.game;
        streamInfo.logo =  data.stream.channel.logo;
        streamInfo.linkText = '<a href="https://www.twitch.tv/'+streamInfo.name+'" target="blank">Watch here</a>';
        streamInfo.link = data.stream._links.self;
        streamData[i]= streamInfo;
        insertStream(streamInfo,i);
    }

  }



/// TODO: Need to work out overflow, or concats for long names
  function insertStream(streamObj, index){
    var logoHTML = '<img class="img-responsive img-rounded" src="'+streamObj.logo+'" alt="">';
    var streamHTML = '<p class="streamName">'+ streamObj.name +'</p>';
    var textHTML =  '<p class="streamText">'+ streamObj.text +'</p>';
    var linkHTML =  '<p class="linkText">'+ streamObj.linkText +'</p>';
    var tileHTML = '<div class="streamerTile col-xs-12 col-md-4  '+streamObj.status+'">'+streamHTML+logoHTML+textHTML+linkHTML+'</div>';
    $('#streamsContainer').append(tileHTML);
  };

  function getChannel(channelData,i){

    var streamInfo = {
      'logo':'',
      'text':'',
      'name:':'',
      'link':'',
      'status':'',
      'linkText':'',
    }

    if(channelData.error){
      console.log('channel is not found ERROR');
      channels.pop();
    }
    else{
      console.log('channel is found !!!');
      streamInfo.text = " is OFFLINE";
      streamInfo.status = "offline"
      streamInfo.name = channelData.name;
      streamInfo.link = channelData._links.self;
      streamInfo.linkText = '<a href="https://www.twitch.tv/'+channelData.name+'/videos/all" target="blank">Go to channel</a>';
      streamInfo.logo = channelData.logo;
      streamData[i]= streamInfo;
      insertStream(streamInfo,i);
    }





  }

function errorMessage(){
  $('.error').fadeIn('fast');
  setTimeout(function(){
    $('.error').fadeOut('slow');
  },2000);
}


  //add stream input bar functions
  $('#search-stream').keypress(function(event){
  if(event.keyCode == 13){
    $('#search-btn').click();
  }
});
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
          fetchData(data, channels.length-1, searchText);
        },
        error: function(){
          console.log("Couldn't access JSON");
        }
      });
      streamCount = channels.length;
    }
    $('#search-stream').val('');

  })

  //online only and all button functions
  $('#show_online').click(function(){
    $('.offline').hide(600);
  })

  $("#show_all").click(function(){
    console.log('show all');
    $('.streamerTile').show(600);
  })
});
