import axios from 'axios';

import { BINANCE_HEADERS, getSignature, getUrl } from './utils';

export const getUserAccount = async () => {
  const timestamp = Date.now();

  const params = {
    timestamp,
    signature: getSignature(`timestamp=${timestamp}`)
  };

  const response = await axios.request({
    url: getUrl('account'),
    method: 'get',
    params,
    headers: BINANCE_HEADERS
  });

  return response.data;
};
