const express = require('express');
const WebSocket = require('ws');
const fetch = require('node-fetch');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.get('/', (req, res) => {
  res.send('WebSocket Proxy is running!');
});

wss.on('connection', (ws) => {
  ws.on('message', async (message) => {
    const url = message.toString();
    try {
      const response = await fetch(url);
      const body = await response.text();
      ws.send(JSON.stringify({ status: 'ok', body }));
    } catch (err) {
      ws.send(JSON.stringify({ status: 'error', error: err.message }));
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
