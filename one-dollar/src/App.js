import React from 'react';

import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Header from './Header';
import Session from './Session';
import Markets from './Markets';
import Orders from './Orders';
import Filter from './Filter';
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
  const [hdoState, setHDOState] = useState({markets: {}, orders: []});
  const [eventFilter, setEventFilter] = useState('');
  const [marketFilter, setMarketFilter] = useState('');
  const [ssid, setSSID] = useState('');
  const [time, setTime] = useState('');

  const events = [
    ...new Set(
      Object.entries(hdoState.markets)
        .map(([marketId, value]) => value.eventName)
        .filter(Boolean),
    ),
  ];

  const marketNames = [
    ...new Set(
      Object.entries(hdoState.markets)
        .map(([marketId, value]) => value.marketName)
        .filter(Boolean),
    ),
  ];

  useEffect(() => {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };

    client.onmessage = (message) => {
      const data = JSON.parse(message.data);

      if (data.orders != null) {
        setHDOState((state) => {
          return {...state, orders: data.orders};
        });
      }

      if (data.marketChange != null) {
        setHDOState((state) => {
          return {
            ...state,
            markets: {
              ...state.markets,
              [data.marketChange.marketId]: data.marketChange,
            },
          };
        });
      }

      if (data.session != null) {
        setSSID(data.session.ssid);
        setTime(data.session.time);
      }
    };
  }, []);

  return (
    <Container maxWidth="md">
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Header />
          <Session ssid={ssid} time={time} />
          <Filter
            events={events}
            selectedEventFilter={eventFilter}
            setEventFilter={setEventFilter}
            marketNames={marketNames}
            selectedMarketFilter={marketFilter}
            setMarketFilter={setMarketFilter}
          />
          <Orders
            orders={hdoState.orders}
            selectedEventFilter={eventFilter}
            selectedMarketFilter={marketFilter}
          />
          <Markets
            markets={hdoState.markets}
            selectedEventFilter={eventFilter}
            selectedMarketFilter={marketFilter}
          />
        </Grid>
      </div>
    </Container>
  );
}

export default App;
