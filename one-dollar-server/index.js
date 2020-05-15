const webSocketsServerPort = 8000;
const webSocketServer = require('websocket').server;
const http = require('http');
const redis = require('redis');

const SESSION_KEY = 'session';

const server = http.createServer();
server.listen(webSocketsServerPort);
const wsServer = new webSocketServer({
  httpServer: server,
});

const connections = {};
const cacheClient = redis.createClient();

// Generates unique ID for every new connection
const getUniqueID = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return s4() + s4() + '-' + s4();
};

const sendMessage = (json) => {
  Object.values(connections).map((connection) => {
    connection.sendUTF(json);
  });
};

wsServer.on('request', function (request) {
  var userID = getUniqueID();
  const conn = request.accept(null, request.origin);
  connections[userID] = conn;

  // user disconnected
  conn.on('close', function (connection) {
    delete connections[userID];
  });
});

function applyUpdates(currentData, newData) {
  const newLastData = [];
  const newMarketChanges = [];

  if (currentData.lastData.length > 0) {
    const lastDataEntryTimestamp =
      currentData.lastData[currentData.lastData.length - 1].t;

    newData.lastData.forEach((data) => {
      if (data.t <= lastDataEntryTimestamp) {
        return;
      }
      newLastData.push(data);
    });
  }

  if (currentData.marketChanges.length > 0) {
    const lastMarketChangeEntryTimestamp =
      currentData.marketChanges[currentData.marketChanges.length - 1].t;

    newData.marketChanges.forEach((data) => {
      if (data.t <= lastMarketChangeEntryTimestamp) {
        return;
      }
      newMarketChanges.push(data);
    });
  }

  return {
    ...currentData,
    lastData: [...currentData.lastData, ...newLastData],
    marketChanges: [...currentData.marketChanges, ...newMarketChanges],
  };
}

function updateSession(cacheClient) {
  cacheClient.get('session', function (err, session) {
    if (err) {
      console.log('Error while getting session', err);
      return;
    }

    sendMessage(
      JSON.stringify({
        session: JSON.parse(session),
      }),
    );
  });

  setTimeout(() => updateSession(cacheClient), 5 * 60 * 1000);
}

function main() {
  const marketsToSubscribe = process.argv[2].split(',');
  const subscriber = redis.createClient();
  updateSession(subscriber.duplicate());

  let currentState = {};

  subscriber.on('message', function (channel, message) {
    if (message == null || message.trim() === '') {
      return;
    }

    if (channel === 'orders') {
      const orders = JSON.parse(message);
      sendMessage(
        JSON.stringify({
          orders,
        }),
      );
    } else {
      const marketStateReceived = JSON.parse(message);
      let newMarketState;
      if (channel in currentState) {
        newMarketState = applyUpdates(
          currentState[channel],
          marketStateReceived,
        );
      } else {
        newMarketState = marketStateReceived;
      }

      currentState[channel] = newMarketState;

      sendMessage(
        JSON.stringify({
          marketChange: newMarketState,
        }),
      );
    }
  });

  [...marketsToSubscribe, 'orders'].forEach((channel) => {
    const output = subscriber.subscribe(channel);
    console.log('Channel subscribed:', channel, output);
  });
}

main();
