const webSocketsServerPort = 8000;
const webSocketServer = require('websocket').server;
const http = require('http');
const redis = require('redis');

const UNDER_35_KEY = 'MARKET_UNDER_35';
const SESSION_KEY = 'session';

const server = http.createServer();
server.listen(webSocketsServerPort);
const wsServer = new webSocketServer({
  httpServer: server,
});

const connections = {};
const cacheClient = redis.createClient();
let sessionImage = null;
let under35Image = null;

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

  conn.sendUTF(JSON.stringify({under35: under35Image, session: sessionImage}));

  // user disconnected
  conn.on('close', function (connection) {
    delete connections[userID];
  });
});

function updateUnder35Image(newData) {
  if (under35Image == null) {
    under35Image = newData;
    return;
  }

  const newLastData = [];
  const newMarketChanges = [];

  if (under35Image.lastData.length > 0) {
    const lastDataEntryTimestamp =
      under35Image.lastData[under35Image.lastData.length - 1].t;

    newData.lastData.forEach((data) => {
      if (data.t <= lastDataEntryTimestamp) {
        return;
      }
      newLastData.push(data);
    });
  }

  if (under35Image.marketChanges.length > 0) {
    const lastMarketChangeEntryTimestamp =
      under35Image.marketChanges[under35Image.marketChanges.length - 1].t;
    newData.marketChanges.forEach((data) => {
      if (data.t <= lastMarketChangeEntryTimestamp) {
        return;
      }
      newMarketChanges.push(data);
    });
  }

  under35Image = {
    ...under35Image,
    lastData: [...under35Image.lastData, ...newLastData],
    marketChanges: [...under35Image.marketChanges, ...newMarketChanges],
  };
}

function loop() {
  cacheClient.hget(UNDER_35_KEY, UNDER_35_KEY, function (err, under35) {
    if (err) {
      console.log('Error while getting under 35', err);
      return;
    }

    const parsedUnder35 = JSON.parse(under35);
    updateUnder35Image(parsedUnder35);

    cacheClient.get(SESSION_KEY, function (err2, session) {
      if (err2) {
        console.log('Error while getting session', err2);
        return;
      }

      sessionImage = JSON.parse(session);
      sendMessage(
        JSON.stringify({
          lastData: under35Image != null ? under35Image.lastData : [],
          marketChanges: under35Image != null ? under35Image.marketChanges : [],
          session: sessionImage,
        }),
      );
      setTimeout(loop, 1000);
    });
  });
}

loop();
