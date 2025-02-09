const WebSocket = require('ws');
const net = require('net');

const WEBSOCKET_PORT = 3008;
const TCP_PORT = 3000;
const TCP_HOST = 'localhost';

const wss = new WebSocket.Server({ port: WEBSOCKET_PORT }, () => {
  console.log(`🚀 Proxy démarré : ws://localhost:${WEBSOCKET_PORT} -> tcp://${TCP_HOST}:${TCP_PORT}`);
});

wss.on('connection', (ws) => {
  console.log('🔌 Nouvelle connexion WebSocket');
  
  const tcpSocket = net.connect({ 
    port: TCP_PORT, 
    host: TCP_HOST 
  });

  let tcpBuffer = Buffer.alloc(0);
  let expectedLength = 0;

  // Gestion de la connexion TCP
  tcpSocket.on('connect', () => {
    console.log('✅ Connecté au serveur LSP TCP');
  });

  // Gestion des données TCP -> WebSocket
  tcpSocket.on('data', (data) => {
    console.log(`📥 [TCP→WS] Réception de ${data.length} octets`);
    tcpBuffer = Buffer.concat([tcpBuffer, data]);

    while (true) {
      if (expectedLength === 0) {
        const headerEnd = tcpBuffer.indexOf('\r\n\r\n');
        if (headerEnd === -1) {
          console.log('⏳ En attente des en-têtes complets...');
          break;
        }

        const headers = tcpBuffer.subarray(0, headerEnd).toString();
        console.log('📨 En-têtes reçus:', headers);

        const contentLengthMatch = headers.match(/Content-Length: (\d+)/i);
        if (!contentLengthMatch) {
          console.error('❌ En-tête Content-Length manquant');
          break;
        }

        expectedLength = parseInt(contentLengthMatch[1], 10);
        console.log(`🔢 Content-Length détecté: ${expectedLength} octets`);

        tcpBuffer = tcpBuffer.subarray(headerEnd + 4);
      }

      if (tcpBuffer.length >= expectedLength) {
        const message = tcpBuffer.subarray(0, expectedLength);
        console.log('📤 Envoi message au client:', message.toString());
        ws.send(message.toString());
        
        tcpBuffer = tcpBuffer.subarray(expectedLength);
        expectedLength = 0;
      } else {
        console.log(`⏳ Attente données restantes: ${expectedLength - tcpBuffer.length} octets`);
        break;
      }
    }
  });

  // Gestion des messages WebSocket -> TCP
  ws.on('message', (data) => {
    const rawData = data.toString();
    console.log(`📤 [WS→TCP] Message brut (${rawData.length} caractères):\n${rawData}`);

    try {
      const contentLength = Buffer.byteLength(rawData, 'utf8');
      const lspMessage = `Content-Length: ${contentLength}\r\n\r\n${rawData}`;
      
      console.log(`📨 [WS→TCP] Message formaté (${lspMessage.length} octets):`);
      console.log(lspMessage);
      
      tcpSocket.write(lspMessage);
    } catch (err) {
      console.error('❌ Erreur de formatage:', err);
    }
  });

  // Gestion des erreurs améliorée
  tcpSocket.on('error', (err) => {
    console.error('🔥 Erreur TCP:', err);
    ws.close(1011, 'Erreur de connexion LSP');
  });

  ws.on('error', (err) => {
    console.error('💥 Erreur WebSocket:', err);
    tcpSocket.destroy();
  });

  // Nettoyage des connexions
  const cleanUp = () => {
    tcpSocket.removeAllListeners();
    ws.removeAllListeners();
  };

  ws.on('close', () => {
    console.log('🔴 Connexion WebSocket fermée');
    cleanUp();
    tcpSocket.end();
  });

  tcpSocket.on('close', () => {
    console.log('🔴 Connexion TCP fermée');
    cleanUp();
    ws.close();
  });
});

console.log('🔍 En attente de connexions WebSocket...');