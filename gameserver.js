import WebSocket from 'ws';
var colors = 'DodgerBlue DarkOrange ForestGreen RebeccaPurple LightSeaGreen Tomato'.split(' ');
class Player {
  constructor(ws, gameServer) {
    this.ws = ws;
    this.gameServer = gameServer;
    this.pos = gameServer.getRandomPos();
    this.color = gameServer.getRandomPlayerColor();
    this.id = this.makePlayerID();
  }
  sendStatus() {
    var statusJSON = JSON.stringify({"pos": this.pos,
				     "color": this.color,
				     "type": "playerStatus",
				     "id": this.id});
    this.ws.send(statusJSON);
  }
  makePlayerID() {
    return Date.now();
  }
}

class GameServer {
  constructor(httpServer) {
    this.httpServer = httpServer;
    this.players  = [];
    this.wsServer = new WebSocket.Server({ server: httpServer });
    this.wsServer.on('connection', this.connection.bind(this));
  }
  connection(ws) {
    var player = this.createPlayer(ws);
    player.sendStatus();
    
  }
  toEverybody(data) {
    this.players.forEach(function each(player) {
      if (player.ws.readyState == WebSocket.OPEN) {
	player.ws.send(data);
      }
    });
  }
  createPlayer(ws) {
    var player = new Player(ws, this);
    this.players.push(player);
    return player;
  }
  getRandomPos() {
    return {x: Math.floor(Math.random() * 300) + 50,
	    y: Math.floor(Math.random() * 300) + 50};
  }
  getRandomPlayerColor() {
    return colors[this.players.length % colors.length];
  }
}

export {GameServer};

