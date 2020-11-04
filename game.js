function fitCanvasToWindow (){
  var width = window.innerWidth;
  var height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}
var canvas = document.createElement("canvas");
console.log(document.body);
document.body.insertAdjacentElement("afterbegin", canvas);
fitCanvasToWindow();
window.onresize = fitCanvasToWindow;
var twoDee = canvas.getContext("2d");
twoDee.fillStyle = "red";
twoDee.fillRect(0,0,canvas.width,canvas.height);


function draw(time) {
//  var y1 = Math.floor(time) % (canvas.height);
//  console.log({time, y1});
  twoDee.fillStyle = "white";
  twoDee.fillRect(0,0,canvas.width,canvas.height);
  player.draw();
  requestAnimationFrame(draw);
}

class Player {
  constructor(x, y, vel) {
    this.x = x;
    this.y = y;
    this.dir = false; // false or NESW
    this.vel = vel;
  }
  walk(walkdir) {
    if (!this.dir){
      this.lastTime = Date.now();
    }
    this.dir = walkdir;
    this.vel = 0.5; // pixels per milisecond
  }
  stop() {
    this.dir = false;
  }
  draw() {
    this.updatePosition();
    twoDee.fillStyle = "blue";
    twoDee.beginPath();
    twoDee.ellipse(this.x, this.y, 10, 10, 0, 0, 6.28, 0);
    twoDee.stroke();
  }
  updatePosition() {
    var timeDelta = Date.now() - this.lastTime;
    this.lastTime = Date.now();
    var spaceDelta = timeDelta * this.vel;
    switch (this.dir) {
    case "N":
      this.y = this.y - spaceDelta;
      break;
    case "E":
      this.x = this.x + spaceDelta;
      break;
    case "S":
      this.y = this.y + spaceDelta;
      break;
    case "W":
      this.x = this.x - spaceDelta;
      break;
    }
  }
}

var player = new Player(50, 50, 0);

// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
function checkKeyEvent(event) {
  const keyName = event.key;
  //  console.log({event.key, event});
  var keyUpOrDown = event.type; // 'keydown' or 'keyup'
  if (keyUpOrDown == 'keyup'){
    player.stop();
    return;
  };
  switch (event.code) {
  case "KeyW": // go north
    if (keyUpOrDown == 'keydown'){
      player.walk("N");
    }
    break;
  case "KeyD": // go east
    if (keyUpOrDown == 'keydown'){
      player.walk("E");
    }
    break;
  case "KeyS": // go south
    if (keyUpOrDown == 'keydown'){
      player.walk("S");
    }
    break;
  case "KeyA": // go west
    if (keyUpOrDown == 'keydown'){
      player.walk("W");
    }
    break;
  }
}
document.addEventListener('keydown', checkKeyEvent);
document.addEventListener('keyup', checkKeyEvent);
requestAnimationFrame(draw);
