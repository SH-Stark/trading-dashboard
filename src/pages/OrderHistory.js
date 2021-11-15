import { filter, orderBy, flatten } from 'lodash';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';

// material
import {
  Card,
  Table,
  Stack,
  // Avatar,
  // Button,
  // Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { OrderListHead, OrderListToolbar } from '../components/_dashboard/order';
//

import { fDateTime } from '../utils/formatTime';
import { fCurrency } from '../utils/formatNumber';
import { tradesAtom } from '../recoil/atoms';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'symbol', label: 'Symbol' },
  { id: 'side', label: 'Side' },
  { id: 'time', label: 'Time' },
  { id: 'pnl', label: 'Realized PnL' },
  { id: 'price', label: 'Price' },
  { id: 'quoteQty', label: 'Quote quantity' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderedBy) {
  if (b[orderedBy] < a[orderedBy]) {
    return -1;
  }
  if (b[orderedBy] > a[orderedBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderedBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderedBy)
    : (a, b) => -descendingComparator(a, b, orderedBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_order) => _order.symbol.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

const OrderHistory = () => {
  const trades = useRecoilValue(tradesAtom);

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderedBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const orderedTrades = orderBy(flatten(Object.values(trades)), ['time'], ['desc']);

  const handleRequestSort = (event, property) => {
    const isAsc = orderedBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = orderedTrades.map((n) => n.symbol);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orderedTrades.length) : 0;

  const filteredOrders = applySortFilter(
    orderedTrades,
    getComparator(order, orderedBy),
    filterName
  );

  const isOrderNotFound = filteredOrders.length === 0;

  return (
    <Page title="Order History | Futures">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Order history
          </Typography>
        </Stack>

        <Card>
          <OrderListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <OrderListHead
                  order={order}
                  orderBy={orderedBy}
                  headLabel={TABLE_HEAD}
                  rowCount={orderedTrades.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredOrders
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { id, symbol, buyer, realizedPnl, time, quoteQty, price } = row;
                      const isItemSelected = selected.indexOf(symbol) !== -1;

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell align="center">
                            <Typography variant="subtitle2" noWrap>
                              {symbol}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Label variant="ghost" color={buyer ? 'info' : 'success'}>
                              {buyer ? 'BUY' : 'SELL'}
                            </Label>
                          </TableCell>
                          <TableCell align="center">{fDateTime(time)}</TableCell>
                          <TableCell align="center">{fCurrency(realizedPnl)}</TableCell>
                          <TableCell align="center">{price}</TableCell>
                          <TableCell align="center">{quoteQty}</TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isOrderNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[25, 100, 1000]}
            component="div"
            count={orderedTrades.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
};

export default OrderHistory;
