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
    $.getJSON(streams_api+x+clientID, function(data){
       streamData.push(data);
    });
  });
 console.log(streamData[0]);

  var createRows = function(rows){
    for(i=0;i<rows;i++){
      $("#streamsContainer").append('<div class="row"></div>')
    }
  }

  var insertStream = function(){
    $("#streamsContainer > row:nth-child(1)").append('abc');
    streamData.forEach(function(stream,i){
      var streamRow = Math.ceil(i/3);
      $("#streamsContainer:nth-child(1)").append('abc');
    })
  }


  createRows(rows);
  insertStream();



});
