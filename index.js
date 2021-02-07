const Hapi = require('@hapi/hapi');
// const socket = require('socket.io')
const socket = require('socket.io');
// const content = require('fs').readFileSync(__dirname + '/temp.html', 'utf8');
// const content = require('fs').readFileSync('/home/iauro/zzzz/workworkwork/pocs and stuff/ResumableFileUploader/resumeUpload-ui/src/index.html', 'utf8');
const socketIO = require('./socket.js');

let serverConnectionOptions = {
  port: 3000,
  host: 'localhost',
  state: {
    strictHeader: false,
    ignoreErrors: true
  },
  routes: {
    cors: true,
    timeout: {
      server: 1200000, // 1,200,000 or 20 minutes
      socket: 1300000
    }
  }
};

const server = new Hapi.Server(serverConnectionOptions);

const io = socket(server.listener, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"],
    allowedHeaders: ["authorization"],
    credentials: true
  }
});

const endpoints = {
  method: 'GET',
  path: '/',
  handler: function (request, h) {
      return null;
  }
}
server.route(endpoints);

server.start();

server.events.on('start', (route) => {
  console.log('Node server is running on ==> ', server.info.uri);
});

io.sockets.on('connection', socket => {
  socketIO(socket);
});
