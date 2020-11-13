function makeWebSocket() {
  var protocol;
  if (document.location.protocol == 'https:'){
    protocol = 'wss';
  } else {
    protocol = 'ws';
  }
  return new WebSocket(protocol + '://' + document.location.host);
}
var ws = makeWebSocket();
function handleMessage(messageEvent) {
  console.log(messageEvent);
  var msg = JSON.parse(messageEvent.data);
  switch (msg.type) {
  case "initPlayer":
    localPlayer.setPosition(msg.pos.x, msg.pos.y);
    localPlayer.color = msg.color;
    var oldID = localPlayer.id;
    delete entities[oldID];
    localPlayer.id = msg.id;
    entities[localPlayer.id] = localPlayer;
    break;
  case "playerStatus":
    if (localPlayer.id != msg.id) {
      var aPlayer = entities[msg.id];
      if (!aPlayer) {
	aPlayer = new Player(msg.pos.x, msg.pos.y);
	aPlayer.id = msg.id;
	aPlayer.color = msg.color;
	entities[aPlayer.id] = aPlayer;
      }
    }
    break;
  }
}
ws.onmessage = handleMessage;
function fitCanvasToWindow() {
  var width = window.innerWidth;
  var height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}
var canvas = document.createElement("canvas");
console.log(document.body);
document.body.insertAdjacentElement("afterbegin", canvas);
canvas.style = "position:absolute; top:0; left:0;";
fitCanvasToWindow();
window.onresize = fitCanvasToWindow;
var twoDee = canvas.getContext("2d");
twoDee.fillStyle = "red";
twoDee.fillRect(0,0,canvas.width,canvas.height);

var entities = {};

function tick(time) {
//  var y1 = Math.floor(time) % (canvas.height);
//  console.log({time, y1});
  twoDee.fillStyle = "white";
  twoDee.fillRect(0,0,canvas.width,canvas.height);
  for (const entityID in entities) {
    var anEntity = entities[entityID];
    anEntity.updatePosition();
    anEntity.draw();
  }
  requestAnimationFrame(tick);
}

class Entity {
  constructor(x=0, y=0, vx=0, vy=0) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.lastTime = Date.now();
    this.id = this.lastTime;
  }
  updatePosition() {
    var timeDelta = Date.now() - this.lastTime;
    this.lastTime = Date.now();
    var dx = timeDelta * this.vx;
    var dy = timeDelta * this.vy;
    this.y = Math.max(Math.min(this.y + dy, canvas.height-this.radius), this.radius);
    this.x = Math.max(Math.min(this.x + dx, canvas.width-this.radius), this.radius);
  }
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Player extends Entity {
  constructor(...args) {
    super(...args);
    this.radius = 10;
    this.color = "red";
    this.id = null;
  }
  shoot() {
    var bullet = new Bullet(this.x, this.y, this.vx*1.25, this.vy*1.25);
    entities[bullet.id] = bullet;
  }
  shootTo(targetX, targetY){
    var shootSound = document.getElementById("shootSound");
    var vectorX = targetX - this.x;
    var vectorY = targetY - this.y;
    var distance = Math.sqrt(((vectorX*vectorX)+(vectorY*vectorY)));
    var bullet = new Bullet(this.x, this.y, vectorX/distance, vectorY/distance);
    entities[bullet.id] = bullet;
    shootSound.play();
  }
  walk(walkDir, walkOrStop) {
    var walkOrStopInt = walkOrStop ? 1 : 0;
    var vscale = 0.5 * walkOrStopInt; // pixels per millisecond
    switch (walkDir) {
    case "N":
      this.vy = -1 * vscale;
      break;
    case "S":
      this.vy = vscale;
      break;
    case "E":
      this.vx = vscale;
      break;
    case "W":
      this.vx = -1 * vscale;
      break;
    }
    var vx = this.vx;
    var vy = this.vy;
    //    console.log({walkDir, walkOrStop, vx, vy});
  }
  draw() {
    twoDee.fillStyle = this.color;
    twoDee.beginPath();
    twoDee.ellipse(this.x, this.y, this.radius, this.radius, 0, 0, 6.28, 0);
    twoDee.fill();
  }
}

class Bullet extends Entity {
  constructor(...args) {
    super(...args);
    this.radius = 3;
  }
  draw() {
    twoDee.fillStyle = "red";
    twoDee.beginPath();
    twoDee.ellipse(this.x, this.y, this.radius, this.radius, 0, 0, 6.28, 0);
    twoDee.fill();
  }
}

var localPlayer = new Player(50, 50, 0, 0);
entities[localPlayer.id] = localPlayer;

// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
function checkKeyEvent(event) {
  const keyName = event.key;
  // console.log({keyName, event}, event.code);
  var keyUpOrDown = event.type; // 'keydown' or 'keyup'
  var walkOrStop = event.type == 'keydown';
  switch (event.code) {
  case "KeyW": // go north
    localPlayer.walk("N", walkOrStop);
    break;
  case "KeyD": // go east
    localPlayer.walk("E", walkOrStop);
    break;
  case "KeyS": // go south
    localPlayer.walk("S", walkOrStop);
    break;
  case "KeyA": // go west
    localPlayer.walk("W", walkOrStop);
    break;
  case "Space":
    localPlayer.shoot();
    break;
  }
}

function handleClickEvent (event) {
  var targetX = event.clientX;
  var targetY = event.clientY;
  localPlayer.shootTo(targetX, targetY);
}

document.addEventListener('keydown', checkKeyEvent);
document.addEventListener('keyup', checkKeyEvent);
canvas.onclick = handleClickEvent;
requestAnimationFrame(tick);

