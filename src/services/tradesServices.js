import { isEmpty } from 'lodash';
import { format } from 'date-fns';
import axios from 'axios';

import { BINANCE_HEADERS, getSignature, getUrl } from './utils';
import { generateLastNdates } from '../utils/formatTime';

const oneDayTimestamp = 60 * 60 * 24 * 1000;

export const getUserTradesByDate = async (date) => {
  if (isEmpty(date)) return [];

  const startTime = new Date(date).getTime();
  const endTime = startTime + oneDayTimestamp;
  const timestamp = Date.now();
  const limit = 1000;

  const params = {
    startTime,
    endTime,
    limit,
    timestamp,
    signature: getSignature(
      `startTime=${startTime}&endTime=${endTime}&limit=${limit}&timestamp=${timestamp}`
    )
  };

  const response = await axios.request({
    url: getUrl('trades'),
    method: 'get',
    params,
    headers: BINANCE_HEADERS
  });

  return response.data;
};

export const getUserTradesOfTheDay = () => getUserTradesByDate(format(new Date(), 'MM/dd/yyyy'));

export const getTradesOfTheWeek = async () => {
  const lastWeekDates = generateLastNdates(7, 'MM/dd/yyyy');
  const trades = {};

  await axios
    .all(lastWeekDates.map((day) => getUserTradesByDate(day)))
    .then(
      axios.spread((...responses) => {
        lastWeekDates.forEach((day, index) => {
          trades[day] = responses[index];
        });
      })
    )
    .catch((errors) => {
      console.error('Something went wrong when fetching all the weekly trades, error: ', errors);
    });

  return trades;
};
