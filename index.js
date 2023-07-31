const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  // Event listener for "user typing" status from the client
  socket.on('user typing', () => {
    // Broadcast the "user typing" event to other connected clients
    socket.broadcast.emit('user typing', socket.username);
  });

  // Event listener for "user not typing" status from the client
  socket.on('user not typing', () => {
    // Broadcast the "user not typing" event to other connected clients
    socket.broadcast.emit('user not typing');
  });

  // Event listener for "welcome" message
  socket.on('welcome', (msg) => {
    io.emit('welcome! 👋', msg);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
