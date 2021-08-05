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
      "status": "waiting",
      "players": 1,
      "userdata": {
          "1": {
              "character": "test",
              "playerid": 1
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
          response.message += "\nServer is full!"
        } else {
          server[data.code].players++;
          server[data.code].code = data.code;
            server[data.code].userdata["2"] = {
            "character": data.character,
            "player": server[data.code].players,
            "username": data.username
          }
      }
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
          "username": data.username
        }
    }
    }
    }
    ws.send(JSON.stringify(response));
    console.log("Sending: " + JSON.stringify(server[data.code]));
    ws.send(JSON.stringify(server[data.code]));
  } else if (data.type == "getserver") {
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