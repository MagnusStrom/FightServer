
const express = require('express')
const app = express()
const port = 3000
const fs = require('fs');

app.get('/test', (req, res) => {
  res.send("[Server] You're connected to the server!")
});

app.post('/getserver', (req, res) => {
  var response = "";
  response += "[Server] Trying to connect to code " + req.get('code');
  let rawdata = fs.readFileSync('games.json');
  let games = JSON.parse(rawdata);
  if (games[req.get('code')] != null) {
    response += "\n[Server] Found game with code " + req.get('code') + ", joining";
    response += "\n[Server] Character selected: " + req.get('character');
    
    let serverdata = games;
    if (serverdata[req.get('code')].players < 2) {
      serverdata[req.get('code')].players++;
      serverdata[req.get('code')].userdata = {
        [serverdata[req.get('code')].players]: {
        "character": req.get('character'),
        "player": serverdata[req.get('code')].players
      }
    }

      let data = JSON.stringify(serverdata);
      fs.writeFileSync('games.json', data);
      response += "\n[Server] Added to game";
    } else {
      response += "\n[Server] Room is full"
      
    }
  } else {
    response += "\n[Server] Cannot find game with code " + req.get('code') + ' creating new';
    let serverdata = games;
    serverdata[req.get('code')] = {
      "status": "waiting",
      "players": 1,
      "userdata": {
      "1": {
        "character": req.get('character'),
        "player": 1
      }
  }
  }
  response += "\n[Server] Created game! Tell your friend to join code: " + req.get('code') + "(caps matter!)";
  let data = JSON.stringify(serverdata);
  fs.writeFileSync('games.json', data);
  response += "\n[Server] Joined game";
  }
   
  res.send(response);
});

app.listen(port, () => {
  console.log(`Server up at http://localhost:${port}`)
})
