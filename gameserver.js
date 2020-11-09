import WebSocket from 'ws';

class GameServer {
  constructor(httpServer) {
    this.httpServer = httpServer;
    this.players  = [];
    this.wss = new WebSocket.Server({ server: httpServer });
    this.wss.on('connection', this.connection.bind(this));
  }
  connection(ws) {
    ws.on('shoot', console.log);
    ws.send('something');
  }
}

export {GameServer};

