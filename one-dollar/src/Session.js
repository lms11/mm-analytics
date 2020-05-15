import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
  title: {
    fontSize: 14,
  },
});

function Entry({label, value}) {
  return (
    <>
      <strong>{label}:</strong> {value}
    </>
  );
}

export default function Session({ssid, time}) {
  const classes = useStyles();

  return (
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
  );
}
