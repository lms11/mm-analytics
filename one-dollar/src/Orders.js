import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const keyOrder = [
  'marketId',
  'selectionId',
  'betId',
  'p',
  's',
  'side',
  'status',
  'pd',
  'md',
  'ld',
  'lscr',
  'avp',
  'sm',
  'sl',
  'dataStatus',
];

export default function SimpleTable({orders}) {
  const classes = useStyles();

  return (
    <Grid item xs={12}>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>marketId</TableCell>
              <TableCell>selectionId</TableCell>
              <TableCell>betId</TableCell>
              <TableCell>p</TableCell>
              <TableCell>s</TableCell>
              <TableCell>side</TableCell>
              <TableCell>status</TableCell>
              <TableCell>pd</TableCell>
              <TableCell>md</TableCell>
              <TableCell>ld</TableCell>
              <TableCell>lscr</TableCell>
              <TableCell>avp</TableCell>
              <TableCell>sm</TableCell>
              <TableCell>sl</TableCell>
              <TableCell>dataStatus</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((row) => (
              <TableRow key={row.betId + '-' + row.marketId}>
                {keyOrder.map((keyToLookup) => (
                  <TableCell>
                    {row[keyToLookup] != null ? row[keyToLookup] : '-'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}
