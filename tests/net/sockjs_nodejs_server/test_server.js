var http = require('http');
var sockjs = require('sockjs');

var echo = sockjs.createServer({ sockjs_url: '../../../CrossBrowdy/CrossBase/net/sockets/SockJS/sockjs.min.js' /*'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js'*/ });
echo.on('connection', function(conn) {
    conn.write("Welcome to SockJS server!");
	conn.on('data', function(message) {
        conn.write("MESSAGE RECEIVED: " + message);
    });
    conn.on('close', function() {});
});

var server = http.createServer();
echo.installHandlers(server, {prefix:'/echo'});

server.listen(9999);