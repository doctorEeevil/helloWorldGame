import WebSocket from 'ws';
var colors = 'OliveDrab DodgerBlue Tomato DarkOrange MediumPurple LightSeaGreen PaleVioletRed'.split(' ');
class Player {
  constructor(ws, gameServer) {
    this.ws = ws;
    ws.player = this;
    this.gameServer = gameServer;
    this.pos = gameServer.getRandomPos();
    this.color = gameServer.getRandomPlayerColor();
    this.id = this.makePlayerID();
  }
  getStatus() {
    return JSON.stringify({
      "type": "playerStatus",
      "id": this.id,
      "pos": this.pos,
      "color": this.color
    });
  }
  initPlayer() {
    var statusJSON = JSON.stringify({
      "type": "initPlayer",
      "id": this.id,
      "pos": this.pos,
      "color": this.color
    });
    this.ws.send(statusJSON);
  }
  makePlayerID() {
    return Date.now();
  }
}

class GameServer {
  constructor(httpServer) {
    this.httpServer = httpServer;
    this.players  = {};
    this.wsServer = new WebSocket.Server({ server: httpServer });
    this.wsServer.on('connection', this.connection.bind(this));
  }
  connection(ws) {
    var player = this.createPlayer(ws);
    player.initPlayer();
    this.toEverybody(player.getStatus());
    this.meetTheNeighbors(player);
    
  }
  toEverybody(data) {
    for (const player of Object.values(this.players)) {
      if (player.ws.readyState == WebSocket.OPEN) {
	player.ws.send(data);
      }
    }
  }
  createPlayer(ws) {
    var player = new Player(ws, this);
    this.players[player.id] = player;
    return player;
  }
  getRandomPos() {
    return {x: Math.floor(Math.random() * 300) + 50,
	    y: Math.floor(Math.random() * 300) + 50};
  }
  getRandomPlayerColor() {
    return colors[Object.values(this.players).length % colors.length];
  }
  meetTheNeighbors(newPlayer) {
    for (const neighbor of Object.values(this.players)) {
      newPlayer.ws.send(neighbor.getStatus());
    }
  }
  disconnectPlayer(player) {
    
  }
}

export {GameServer};

