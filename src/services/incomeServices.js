import { isEmpty, flatten } from 'lodash';
import { format } from 'date-fns';
import axios from 'axios';

import { BINANCE_HEADERS, getSignature, getUrl } from './utils';
import { generateLastNdates } from '../utils/formatTime';

const ONE_DAY_TIMESTAMP = 60 * 60 * 24 * 1000;
const CHUNK_NUMBER = 3;

const generateNChunksRequest = (date) => {
  if (isEmpty(date)) return [];

  const timestamp = Date.now();
  const limit = 1000;
  const incomeType = 'REALIZED_PNL';

  const dateRequested = new Date(date).getTime();
  const requests = [];

  for (let i = 1; i <= CHUNK_NUMBER; i += 1) {
    const chunkTime = Math.round(ONE_DAY_TIMESTAMP / CHUNK_NUMBER);

    const startTime = dateRequested + (i - 1) * chunkTime;
    const endTime = startTime + chunkTime;

    if (startTime <= new Date().getTime()) {
      // Add the request only if the startTime is in the past

      const params = {
        incomeType,
        startTime,
        endTime,
        limit,
        timestamp,
        signature: getSignature(
          `incomeType=${incomeType}&startTime=${startTime}&endTime=${endTime}&limit=${limit}&timestamp=${timestamp}`
        )
      };

      requests.push(
        axios.request({
          url: getUrl('income'),
          method: 'get',
          params,
          headers: BINANCE_HEADERS
        })
      );
    }
  }

  return requests;
};

export const getUserIncomesByDate = async (date) => {
  if (isEmpty(date)) return [];

  const response = await axios
    .all(generateNChunksRequest(date))
    .then(axios.spread((...responses) => flatten(responses.map((res) => res.data))))
    .catch((errors) => {
      console.error('Something went wrong when fetching getUserIncomesByDate, error: ', errors);
    });

  return response;
};

export const getUserIncomesOfTheDay = () => getUserIncomesByDate(format(new Date(), 'MM/dd/yyyy'));

export const getIncomesOfTheWeek = async () => {
  const lastWeekDates = generateLastNdates(7, 'MM/dd/yyyy');
  const incomes = {};

  await axios
    .all(lastWeekDates.map((day) => getUserIncomesByDate(day)))
    .then(
      axios.spread((...responses) => {
        lastWeekDates.forEach((day, index) => {
          incomes[day] = responses[index];
        });
      })
    )
    .catch((errors) => {
      console.error('Something went wrong when fetching all the weekly incomes, error: ', errors);
    });

  return incomes;
};
