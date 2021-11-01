import { isEmpty, orderBy } from 'lodash';
import { useRecoilValue } from 'recoil';
import { memo } from 'react';
import { format } from 'date-fns';

// material
import { Card, Typography, CardHeader, CardContent, CircularProgress } from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineContent,
  TimelineConnector,
  TimelineSeparator,
  TimelineDot
} from '@mui/lab';

// utils
import { fDateTime } from '../../../utils/formatTime';
import { tradesAtom } from '../../../recoil/atoms';

function Trade({ trade, isLast }) {
  const { side, time, symbol } = trade;

  const title = `Long ${symbol} ${side === 'BUY' ? 'opened' : 'closed'}`;

  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          sx={{
            bgcolor:
              (side === 'BUY' && 'info.main') || (side === 'SELL' && 'success.main') || 'error.main'
          }}
        />
        {isLast ? null : <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        <Typography variant="subtitle2">{title}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {fDateTime(time)}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}

const LastOrders = () => {
  const trades = useRecoilValue(tradesAtom);
  const today = format(new Date(), 'MM/dd/yyyy');

  return (
    <Card
      sx={{
        '& .MuiTimelineItem-missingOppositeContent:before': {
          display: 'none'
        }
      }}
    >
      <CardHeader title="Last Trades" />
      <CardContent>
        <Content trades={trades[today]} />
      </CardContent>
    </Card>
  );
};

const Content = memo(({ trades }) => {
  if (isEmpty(trades)) {
    return <CircularProgress />;
  }

  const orderedTrades = orderBy(trades, ['time'], ['desc']);
  const tradesLength = trades.length;
  const maxLength = 5;

  return (
    <Timeline>
      {orderedTrades.slice(0, maxLength).map((trade, index) => (
        <Trade
          key={trade.id}
          trade={trade}
          isLast={index === tradesLength - 1 || index === maxLength - 1}
        />
      ))}
    </Timeline>
  );
});

export default LastOrders;
