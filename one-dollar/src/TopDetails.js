import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

function Entry({label, value}) {
  return (
    <>
      <strong>{label}:</strong> {value}
    </>
  );
}

export default function SimpleCard({
  state,
  marketID,
  runnerID,
  openDate,
  ssid,
  time,
}) {
  const classes = useStyles();

  return (
    <>
      <Grid item xs={6}>
        <Card>
          <CardContent>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom>
              Game Details
            </Typography>
            <Typography variant="body2" component="p">
              <Entry label="State" value={state} />
              <br />
              <Entry label="Market ID" value={marketID} />
              <br />
              <Entry label="Runner ID" value={runnerID} />
              <br />
              <Entry label="Open date" value={openDate} />
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6}>
        <Card>
          <CardContent>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom>
              Session Details
            </Typography>
            <Typography variant="body2" component="p">
              <Entry label="SSID" value={ssid} />
              <br />
              <Entry label="Time" value={time} />
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
}
