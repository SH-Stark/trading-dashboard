import crypto from 'crypto';

import { CONFIGURATION } from '../config/api-keys';

const BINANCE_URLS = {
  spot: {
    trades: 'https://api.binance.com/api/v3/myTrades',
    income: 'https://api.binance.com/api/v3/account',
    account: 'https://api.binance.com/api/v3/account'
  },
  futures: {
    trades: 'https://fapi.binance.com/fapi/v1/userTrades',
    income: 'https://fapi.binance.com/fapi/v1/income',
    account: 'https://fapi.binance.com/fapi/v2/account'
  }
};

export const BINANCE_HEADERS = {
  Accept: 'Application/json',
  'X-MBX-APIKEY': CONFIGURATION.binance.key
};

export const getSignature = (queryParams) =>
  crypto.createHmac('sha256', CONFIGURATION.binance.secret).update(queryParams).digest('hex');

export const getUrl = (type) => BINANCE_URLS[CONFIGURATION.binance.exchangeType][type];
