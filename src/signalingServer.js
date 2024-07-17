import WebSocket,{ WebSocketServer } from 'ws';

export default (server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      // To Broadcast the message to all connected clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });

    ws.send('Welcome to the WebRTC signaling server');
  });
};
