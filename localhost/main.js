const http = require("http");

const host = 'localhost';
const port = 8000;

const requestListener = function (req, res) {
    res.setHeader("Content-Type", "text/javascript;charset=UTF-8");
    switch (req.url) {
        case "/books":
            res.writeHead(200);
            res.end('Books');
            break
        case "/script":
            res.writeHead(200);
            res.end('alert(\'I\'m from Nodejs!\')');
            break
        default:
            res.writeHead(404);
            res.end(JSON.stringify({error:"Resource not found"}));
    }
}

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});