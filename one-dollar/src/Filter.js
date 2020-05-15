import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  title: {
    fontSize: 14,
  },
}));

export default function Filter({
  events,
  selectedEventFilter,
  setEventFilter,
  marketNames,
  selectedMarketFilter,
  setMarketFilter,
}) {
  const classes = useStyles();
  const handleChangeEventFilter = (event) => {
    setEventFilter(event.target.value);
  };
  const handleChangeMarketFilter = (event) => {
    setMarketFilter(event.target.value);
  };

  return (
    <Grid item xs={6}>
      <Card>
        <CardContent>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom>
            Filter
          </Typography>
          <FormControl className={classes.formControl}>
            <InputLabel id="event-selector-label">Event</InputLabel>
            <Select
              labelId="event-selector-label"
              id="event-selector"
              value={selectedEventFilter}
              onChange={handleChangeEventFilter}>
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {events.map((e) => (
                <MenuItem value={e} key={e}>
                  {e}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select events to filter</FormHelperText>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="market-selector-label">Market</InputLabel>
            <Select
              labelId="market-selector-label"
              id="market-selector"
              value={selectedMarketFilter}
              onChange={handleChangeMarketFilter}>
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {marketNames.map((e) => (
                <MenuItem value={e} key={e}>
                  {e}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select markets to filter</FormHelperText>
          </FormControl>
        </CardContent>
      </Card>
    </Grid>
  );
}
