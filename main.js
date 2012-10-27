
var DEBUG = true;
//var DEBUG = false;

var http = require('http');
var io = require('socket.io');
var util = require('util');
var exec = require('child_process').exec;
var fs = require('fs');
var npmRegistryClient = require('npm-registry-client')

var socketIOClients = new Array();
var messageQueue = new Array();

server = http.createServer(ServerMain);
server.listen('8083');

var socket = io.listen(server);

var npmClient = new npmRegistryClient({registry: 'http://registry.npmjs.org', cache: 'cache'})

setupSocketIOOptions();
setupSocketIOEventHandlers();

function ServerMain(req, res)
{
	//res.writeHead(200, {'Content-Type': 'text/html'});
	//res.end(clientPageData);
}

function setupSocketIOEventHandlers()
{
	socket.on('connection', createSocketIOClient);
}

function setupSocketIOOptions()
{
	socket.enable('browser client minification');
	socket.enable('browser client etag');
	socket.enable('browser client gzip');
	socket.set('log level', 0);
	if(DEBUG) socket.set('log level', 3);
	socket.set('transports',
		[
			'websocket',
			//'flashsocket',
			'htmlfile',
			'xhr-polling',
			'jsonp-polling'
		]
	);
}

function removeSocketIOClient()
{
	if(DEBUG) console.log('Client '+this.store.data.clientID+' Disconnected');
	socketIOClients = socketIOClients.splice(this);
}

function createSocketIOClient(client)
{
	if(DEBUG) console.log('Client '+(socketIOClients.length+1)+' Connected');

	client.set('clientID', socketIOClients.length+1);

	client.on('disconnect', removeSocketIOClient);
	client.on('search', function(data)
	{
		npmClient.get(data.term, "latest", 1000, function (er, npmdata, raw, res)
		{
			client.emit('searchResults', { type: 'searchResults', searchResults: npmdata });
		});
	});

	socketIOClients.push(client);
}
