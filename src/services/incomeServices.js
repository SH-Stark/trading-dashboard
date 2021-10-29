import { isEmpty } from 'lodash';
import { format } from 'date-fns';
import axios from 'axios';

import { BINANCE_HEADERS, getSignature, getUrl } from './utils';
import { generateLastNdates } from '../utils/formatTime';

const oneDayTimestamp = 60 * 60 * 24 * 1000;

export const getUserIncomesByDate = async (date) => {
  if (isEmpty(date)) return [];

  const startTime = new Date(date).getTime();
  const endTime = startTime + oneDayTimestamp;
  const timestamp = Date.now();
  const incomeType = 'REALIZED_PNL';
  const limit = 1000;

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

  const response = await axios.request({
    url: getUrl('income'),
    method: 'get',
    params,
    headers: BINANCE_HEADERS
  });

  return response.data;
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
