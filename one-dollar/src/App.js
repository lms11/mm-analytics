import React from 'react';

import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Header from './Header';
import Graph from './Graph';
import TopDetails from './TopDetails';
import {w3cwebsocket as W3CWebSocket} from 'websocket';
import {useEffect, useState} from 'react';

const client = new W3CWebSocket('ws://127.0.0.1:8000');

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: '20px',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

function App() {
  const classes = useStyles();
  const [gameState, setGameState] = useState('');
  const [marketID, setMarketID] = useState('');
  const [runnerID, setRunnerID] = useState('');
  const [openDate, setOpenDate] = useState('');
  const [ssid, setSSID] = useState('');
  const [time, setTime] = useState('');
  const [lastData, setLastData] = useState([]);
  const [marketChanges, setMarketChanges] = useState([]);

  useEffect(() => {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };

    client.onmessage = (message) => {
      const data = JSON.parse(message.data);
      console.log(data);
      if (data.under35 != null) {
        setGameState(data.under35.state);
        setMarketID(data.under35.marketID);
        setRunnerID(data.under35.runnerID);
        setOpenDate(data.under35.openDate);
      }

      if (data.session != null) {
        setSSID(data.session.ssid);
        setTime(data.session.time);
      }

      if (data.lastData != null) {
        setLastData(data.lastData);
      }

      if (data.marketChanges != null) {
        setMarketChanges(data.marketChanges);
      }
    };
  }, []);

  return (
    <Container maxWidth="md">
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Header />
          <TopDetails
            state={gameState}
            marketID={marketID}
            runnerID={runnerID}
            openDate={openDate}
            ssid={ssid}
            time={time}
          />
          <Graph lastData={lastData} marketChanges={marketChanges} />
        </Grid>
      </div>
    </Container>
  );
}

export default App;
