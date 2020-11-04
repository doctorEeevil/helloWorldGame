function fitCanvasToWindow (){
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

function draw(time) {
//  var y1 = Math.floor(time) % (canvas.height);
//  console.log({time, y1});
  twoDee.fillStyle = "white";
  twoDee.fillRect(0,0,canvas.width,canvas.height);
  player.draw();
  requestAnimationFrame(draw);
}

class Player {
  constructor(x=50, y=50, vx=0, vy=0) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.frames=0;
    this.lastTime = Date.now();
    this.radius = 10;
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
    this.updatePosition();
    //    console.log(this);
    twoDee.fillStyle = "blue";
    twoDee.beginPath();
    twoDee.ellipse(this.x, this.y, this.radius, this.radius, 0, 0, 6.28, 0);
    twoDee.stroke();
    this.frames++;
  }
  updatePosition() {
    var timeDelta = Date.now() - this.lastTime;
    this.lastTime = Date.now();
    var dx = timeDelta * this.vx;
    var dy = timeDelta * this.vy;
    this.y = Math.max(Math.min(this.y + dy, canvas.height-this.radius), this.radius);
    this.x = Math.max(Math.min(this.x + dx, canvas.width-this.radius), this.radius);
  }
}

var player = new Player(50, 50, 0, 0);

// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
function checkKeyEvent(event) {
  const keyName = event.key;
  //  console.log({event.key, event});
  var keyUpOrDown = event.type; // 'keydown' or 'keyup'
  var walkOrStop = event.type == 'keydown';
  switch (event.code) {
  case "KeyW": // go north
    player.walk("N", walkOrStop);
    break;
  case "KeyD": // go east
    player.walk("E", walkOrStop);
    break;
  case "KeyS": // go south
    player.walk("S", walkOrStop);
    break;
  case "KeyA": // go west
    player.walk("W", walkOrStop);
    break;
  }
}
document.addEventListener('keydown', checkKeyEvent);
document.addEventListener('keyup', checkKeyEvent);
requestAnimationFrame(draw);
