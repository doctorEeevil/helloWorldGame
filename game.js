var canvas = document.createElement("canvas");
document.body.insertAdjacentElement("beforeEnd", canvas);
var twoDee = canvas.getContext("2d");
twoDee.fillStyle = "red";
twoDee.fillRect(0,0,canvas.width,canvas.height);

function draw(time) {
//  var y1 = Math.floor(time) % (canvas.height);
//  console.log({time, y1});
  twoDee.fillStyle = "white";
  twoDee.fillRect(0,0,canvas.width,canvas.height);
  requestAnimationFrame(draw);
}

var player = {
  direction: "N",
  velocity: 0
}

// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
function checkKeyEvent(event) {
  const keyName = event.key;
//  console.log({event.key, event});
  var keyUpOrDown = event.type; // 'keydown' or 'keyup'
  switch (event.code) {
  case "KeyW": // go north
    if (keyUpOrDown == 'keydown'){
      //start running north
      console.log("start running north");
    } else {
      //stop running north
    }
    break;
  case "KeyD": // go east
  case "KeyS": // go south
  case "KeyA": // go west
  }
}
document.addEventListener('keydown', checkKeyEvent);
document.addEventListener('keyup', checkKeyEvent);
requestAnimationFrame(draw);
