const WebSocket = require('ws');
const net = require('net');

const WEBSOCKET_PORT = 3008;
const TCP_PORT = 3000;
const TCP_HOST = 'localhost';

const wss = new WebSocket.Server({ port: WEBSOCKET_PORT }, () => {
});

wss.on('connection', (ws) => {
  
  const tcpSocket = net.connect({ 
    port: TCP_PORT, 
    host: TCP_HOST 
  });

  let tcpBuffer = Buffer.alloc(0);
  let expectedLength = 0;

  tcpSocket.on('connect', () => {
    console.log('✅ Connected LSP TCP');
  });

  tcpSocket.on('data', (data) => {
    tcpBuffer = Buffer.concat([tcpBuffer, data]);

    while (true) {
      if (expectedLength === 0) {
        const headerEnd = tcpBuffer.indexOf('\r\n\r\n');
        if (headerEnd === -1) {
          break;
        }

        const headers = tcpBuffer.subarray(0, headerEnd).toString();

        const contentLengthMatch = headers.match(/Content-Length: (\d+)/i);
        if (!contentLengthMatch) {
          break;
        }

        expectedLength = parseInt(contentLengthMatch[1], 10);

        tcpBuffer = tcpBuffer.subarray(headerEnd + 4);
      }

      if (tcpBuffer.length >= expectedLength) {
        const message = tcpBuffer.subarray(0, expectedLength);
        ws.send(message.toString());
        
        tcpBuffer = tcpBuffer.subarray(expectedLength);
        expectedLength = 0;
      } else {
        console.log(`: ${expectedLength - tcpBuffer.length} octets`);
        break;
      }
    }
  });

  ws.on('message', (data) => {
    const rawData = data.toString();
    console.log(`📤 [WS→TCP] Message brut (${rawData.length} caractères):\n${rawData}`);

    try {
      const contentLength = Buffer.byteLength(rawData, 'utf8');
      const lspMessage = `Content-Length: ${contentLength}\r\n\r\n${rawData}`;
      
      console.log(lspMessage);
      
      tcpSocket.write(lspMessage);
    } catch (err) {
      console.error('❌ :', err);
    }
  });

  // Gestion des erreurs améliorée
  tcpSocket.on('error', (err) => {
  });

  ws.on('error', (err) => {
    tcpSocket.destroy();
  });

  const cleanUp = () => {
    tcpSocket.removeAllListeners();
    ws.removeAllListeners();
  };

  ws.on('close', () => {
    cleanUp();
    tcpSocket.end();
  });

  tcpSocket.on('close', () => {
    cleanUp();
    ws.close();
  });
});

