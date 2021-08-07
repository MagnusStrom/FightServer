const WebSocket = require('ws')
 
const wss = new WebSocket.Server({ port: 3920 })
 
var server = {
  "hi": {
      "code": "hi",
      "status": "waiting",
      "players": 2,
      "userdata": {
          "2": {
              "character": "test",
              "playerid": 2
          }
      }
  },
  "russ": {
      "code": "russ",
      "status": "waiting",
      "players": 1,
      "userdata": {
          "1": {
              "character": "test",
              "playerid": 1,
              "x": 200,
              "y": 300
          },
          "2": {
            
          }
      }
  }
}
wss.on('connection', ws => {
  ws.on('message', message => {
    var data = JSON.parse(message);
    if (data.type == "joinrequest") {
      var response = {
        "type": "message",
        "message": "",
        "extra": "joinserver",
        "serverinfo": {}
      }
      if (server[data.code] != null) {
        response.message += "\nServer found! Joining...";
        console.log("SERVER INFO: " + JSON.stringify(server[data.code]));
        if (server[data.code].players > 1) {
          response.message += "\nServer is full!";
          ws.send(JSON.stringify(response));
        } else {
          server[data.code].players++;
          server[data.code].code = data.code;
            server[data.code].userdata["2"] = {
            "character": data.character,
            "player": server[data.code].players,
            "username": data.username,
            "x": 0,
            "y": 0,
            "animation": "idle",
            "hitting": "false",
            "special": "false",
            "facingleft": "false",
            "attackleft": "false",
            "stunned": "false"
          }
      }
      ws.send(JSON.stringify(response));
      console.log("Sending: " + JSON.stringify(server[data.code]));
      ws.send(JSON.stringify(server[data.code]));
    } else {
      response.message += "\nServer not found! Creating...";
      server[data.code] = {
        "code": data.code,
        "status": "waiting",
        "players": 1,
        "userdata": {
        "1": {
          "character": data.character,
          "player": 1,
          "username": data.username,
          "x": 0,
          "y": 0,
          "animation": "idle",
          "hitting": "false",
          "special": "false",
          "facingleft": "false",
          "attackleft": "false",
          "stunned": "false"
        }
    }
    }
    ws.send(JSON.stringify(response));
    console.log("Sending: " + JSON.stringify(server[data.code]));
    ws.send(JSON.stringify(server[data.code]));
    }
  } else if (data.type == "getserver") {
    var response = {
      "type": "message",
      "message": "",
      "serverinfo": {}
    }
    if (server[data.code] == null) {
      response.message += "\nServer not found!";
      ws.send(JSON.stringify(response));
    } else {
     // response.message += "\nGetting data for code " + data.code + "...";
     //console.log("Sending: " + JSON.stringify(server[data.code]));
      ws.send(JSON.stringify(server[data.code]));
    }
  } else if (data.type == "startgame") {
  var response = {
    "type": "message",
    "message": "",
    "serverinfo": {}
  }
  if (server[data.code] == null) {
    response.message += "\nServer not found!";
    ws.send(JSON.stringify(response));
  } else {
   // response.message += "\nGetting data for code " + data.code + "...";
   //console.log("Sending: " + JSON.stringify(server[data.code]));
   server[data.code].status = "started";
    ws.send(JSON.stringify(server[data.code]));
  }
} else if (data.type == "updateplayer") {

  server[data.code].userdata[data.player].x = data.x;
  server[data.code].userdata[data.player].y = data.y;
  server[data.code].userdata[data.player].animation = data.animation;
  server[data.code].userdata[data.player].hitting = data.hitting;
  server[data.code].userdata[data.player].special = data.special;
  server[data.code].userdata[data.player].facingleft = data.facingleft;
  server[data.code].userdata[data.player].attackleft = data.attackleft;
  server[data.code].userdata[data.player].stunned = data.stunned;
  //console.log("ANIM: " + data.animation);
 // console.log("UPDATING DATA: " + JSON.stringify(server[data.code]));
  ws.send(JSON.stringify(server[data.code]));
}
});
  var message = {
    "type": "message",
    "message": "Connected to server!",
    "extra": "none"
  }
  ws.send(JSON.stringify(message));
})


console.log("loaded maybe");