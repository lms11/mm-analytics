import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Graph from './Graph';

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

export default function Markets({
  markets,
  selectedEventFilter,
  selectedMarketFilter,
}) {
  const classes = useStyles();

  return Object.entries(markets)
    .map(([marketId, value]) => {
      if (
        value.eventName !== selectedEventFilter ||
        value.marketName !== selectedMarketFilter
      ) {
        return null;
      }
      return (
        <Grid
          item
          xs={12}
          key={value.eventId + '-' + value.marketId + '-' + value.runnerId}>
          <Card className={classes.root}>
            <CardContent>
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom>
                {value.eventName} ({value.eventId}) - {value.marketId} -{' '}
                {value.marketName}
              </Typography>
              <Graph
                lastData={value.lastData}
                marketChanges={value.marketChanges}
                title={value.runnerId}
              />
            </CardContent>
          </Card>
        </Grid>
      );
    })
    .filter(Boolean);
}
