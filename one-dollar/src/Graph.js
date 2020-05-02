import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

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

export default function SimpleCard({lastData, marketChanges}) {
  const classes = useStyles();

  const openFlags = {
    type: 'flags',
    data: marketChanges
      .filter((x) => x.a === 'OPEN')
      .map((x) => {
        return {x: x.t, title: 'O', text: 'Open'};
      }),
    onSeries: 'dataseries',
    shape: 'circlepin',
    width: 16,
  };

  const suspendedFlags = {
    type: 'flags',
    data: marketChanges
      .filter((x) => x.a === 'SUSPENDED')
      .map((x) => {
        return {x: x.t, title: 'S', text: 'Suspended'};
      }),
    onSeries: 'dataseries',
    shape: 'squarepin',
    width: 16,
  };

  return (
    <Grid item xs={12}>
      <Card className={classes.root}>
        <CardContent>
          <div>
            <HighchartsReact
              highcharts={Highcharts}
              constructorType={'stockChart'}
              options={{
                title: {
                  text: 'Under 3.5 (back)',
                },
                series: [
                  {
                    data: lastData.map((x) => [x.t, x.p]),
                    id: 'dataseries',
                  },
                  openFlags,
                  suspendedFlags,
                ],
              }}
            />
          </div>
        </CardContent>
      </Card>
    </Grid>
  );
}
