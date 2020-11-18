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
    this.vx = 0;
    this.vy = 0;
  }
  getStatus() {
    return JSON.stringify({
      "type": "playerStatus",
      "id": this.id,
      "pos": this.pos,
      "color": this.color
    });
  }
  getStatusUpdate() {
    return JSON.stringify({
      "type": "playerStatusUpdate",
      "id": this.id,
      "pos": this.pos,
      "vx": this.vx,
      "vy": this.vy
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
  destroy() {
    this.gameServer.removePlayer(this);
    /*
      Avoid a memory leak by removing player from its socket.
      Remember that player has player.ws but ws has ws.player too! 
    */
    delete this.ws['player'];
  }
  movementChange(msg) {
    this.pos.x = msg.x;
    this.pos.y = msg.y;
    this.vx = msg.vx;
    this.vy = msg.vy;
    this.gameServer.announceMovementChange(this);
  }
  handleMessage(messageEvent) {
    var msg = JSON.parse(messageEvent.data);
    switch (msg.type) {
    case "movementChange":
      this.movementChange(msg);
      break;
    }
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
    ws.onmessage = player.handleMessage.bind(player);
    ws.onclose = player.destroy.bind(player);
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
  removePlayer(player) {
    console.log("a player has disconnected! player id was", player.id);
    delete this.players[player.id];
  }
  announceMovementChange(player) {
    this.toEverybody(player.getStatusUpdate());
  }
}

export {GameServer};

