import { atom } from 'recoil';
import { generateLastNdates } from '../../utils/formatTime';

const generateEmptyTrades = () => {
  const lastWeekDates = generateLastNdates(7, 'MM/dd/yyyy');
  const emptyTrades = {};

  lastWeekDates.forEach((d) => {
    emptyTrades[d] = [];
  });

  return emptyTrades;
};

const tradesAtom = atom({
  key: 'tradesState',
  default: generateEmptyTrades()
});

export default tradesAtom;
