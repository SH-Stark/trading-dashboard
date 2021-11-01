import { isEmpty, flatten } from 'lodash';
import { format } from 'date-fns';
import axios from 'axios';

import { BINANCE_HEADERS, getSignature, getUrl } from './utils';
import { generateLastNdates } from '../utils/formatTime';

const ONE_DAY_TIMESTAMP = 60 * 60 * 24 * 1000;
const CHUNK_NUMBER = 8;

const generateNChunksRequest = (sliceNumbers, date) => {
  if (isEmpty(date)) return [];

  const timestamp = Date.now();
  const limit = 1000;

  const dateRequested = new Date(date).getTime();
  const requests = [];

  for (let i = 1; i <= sliceNumbers; i += 1) {
    const chunkTime = Math.round(ONE_DAY_TIMESTAMP / sliceNumbers);

    const startTime = dateRequested + (i - 1) * chunkTime;
    const endTime = startTime + chunkTime;

    if (startTime <= new Date().getTime()) {
      // Add the request only if the startTime is in the past

      const params = {
        startTime,
        endTime,
        limit,
        timestamp,
        signature: getSignature(
          `startTime=${startTime}&endTime=${endTime}&limit=${limit}&timestamp=${timestamp}`
        )
      };

      requests.push(
        axios.request({
          url: getUrl('trades'),
          method: 'get',
          params,
          headers: BINANCE_HEADERS
        })
      );
    }
  }

  return requests;
};

export const getUserTradesByDate = async (date) => {
  if (isEmpty(date)) return [];

  const response = await axios
    .all(generateNChunksRequest(CHUNK_NUMBER, date))
    .then(axios.spread((...responses) => flatten(responses.map((res) => res.data))))
    .catch((errors) => {
      console.error('Something went wrong when fetching getUserTradesByDate, error: ', errors);
    });

  return response;
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
