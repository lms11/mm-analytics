import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import logo from './logo.jpg';

export default function SimpleCard() {
  return (
    <Grid container direction="row" justify="center" alignItems="center">
      <Grid item xs={3}>
        <img src={logo} width="100%" />
      </Grid>
      <Grid item xs={9}>
        <Typography variant="h4" gutterBottom>
          <strong>One Dollar Goal</strong>
        </Typography>
      </Grid>
    </Grid>
  );
}
