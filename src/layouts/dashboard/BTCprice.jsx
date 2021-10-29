import React, { useCallback, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';

import { Box, Typography, Stack, Grid } from '@mui/material';
import { fCurrency, fPercent } from '../../utils/formatNumber';

const socketUrl = 'wss://fstream.binance.com/stream';

const BTCprice = () => {
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(socketUrl);

  useEffect(() => {
    console.log('Opening websocket for BTC data');
    subscribeWebsocket();

    return () => {
      console.log('Closing websocket for BTC data');
      unsubscribeWebsocket();
    };
  }, []);

  const subscribeWebsocket = useCallback(
    () =>
      sendJsonMessage({
        method: 'SUBSCRIBE',
        params: ['btcusdt@ticker'],
        id: 1
      }),
    [sendJsonMessage]
  );

  const unsubscribeWebsocket = useCallback(
    () =>
      sendJsonMessage({
        method: 'UNSUBSCRIBE',
        params: ['btcusdt@ticker'],
        id: 1
      }),
    [sendJsonMessage]
  );

  return (
    <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
      <Stack
        alignItems="center"
        sx={{
          p: 2.5,
          pt: 5,
          borderRadius: 2,
          position: 'relative',
          bgcolor: 'grey.200'
        }}
      >
        <Box
          component="img"
          src="/static/illustrations/BTC_Logo.svg"
          sx={{ width: 50, position: 'absolute', top: -30 }}
        />

        <Box>
          <Grid container>
            <Typography style={{ marginRight: 8 }} variant="h5" sx={{ color: 'text.info' }}>
              {fCurrency(Math.round(lastJsonMessage?.data?.c))}
            </Typography>

            <Typography color={lastJsonMessage?.data?.P > 0 ? 'green' : 'red'} variant="overline">
              {fPercent(lastJsonMessage?.data?.P)}
            </Typography>
          </Grid>
        </Box>
      </Stack>
    </Box>
  );
};

export default BTCprice;
