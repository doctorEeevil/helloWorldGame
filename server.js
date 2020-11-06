// Based on sample from https://www.sysleaf.com/nodejs-pure-http-server/
const http = require("http");
const fs = require("fs");
const path = require("path");

const httpServer = http.createServer(requestResponseHandler);
httpServer.listen(3000, '127.0.0.1', () => {
  console.log("Node.JS static file server is listening on port 3000");
});
function requestResponseHandler(request, response) {
  console.log(`Request came: ${request.url}`);
  if (request.url === "/") {
    sendResponse("index.html", "text/html", response);
  } else {
    sendResponse(request.url, getContentType(request.url), response);
  }
}

function sendResponse(url, contentType, res) {
  let file = path.join(__dirname, url);
  fs.readFile(file, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.write(`File '${file}' Not Found!`);
      res.end();
      console.log("Response: 404 ${file}, err");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.write(content);
      res.end();
      console.log(`Response: 200 ${file}`);
    }
  });
}

function getContentType(url) {
  switch (path.extname(url)) {
    case ".html":
      return "text/html";
    case ".css":
      return "text/css";
    case ".js":
      return "text/javascript";
    case ".json":
      return "application/json";
    default:
      return "application/octate-stream";
  }
}
/*
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  console.log(req);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('<body><script src="game.js"></script></body>');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
*/
