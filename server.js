// Based on sample from https://www.sysleaf.com/nodejs-pure-http-server/
const http = require("http");
const fs = require("fs");
const path = require("path");
const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(requestResponseHandler);
httpServer.listen(PORT, '127.0.0.1', () => {
  console.log(`Node.JS static file server is listening on port ${PORT}`);
});
function requestResponseHandler(req, res) {
  console.log(`Request came: ${req.url}`);
  if (req.url === "/") {
    sendResponse("index.html", "text/html", res);
  } else {
    sendResponse(req.url, getContentType(req.url), res);
  }
}

function sendResponse(url, contentType, res) {
  let filePath = path.join(__dirname, url);
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.write(`File '${filePath}' Not Found!`);
      res.end();
      console.log("Response: 404 ${filePath}, err");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.write(content);
      res.end();
      console.log(`Response: 200 ${filePath}`);
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
  case ".wav":
    return "audio/wav";
  default:
    return "application/octate-stream";
  }
}
