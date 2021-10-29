import { atom } from 'recoil';
import { generateLastNdates } from '../../utils/formatTime';

const generateEmptyIncomes = () => {
  const lastWeekDates = generateLastNdates(7, 'MM/dd/yyyy');
  const emptyIncomes = {};

  lastWeekDates.forEach((d) => {
    emptyIncomes[d] = [];
  });

  return emptyIncomes;
};

const incomesAtom = atom({
  key: 'incomesState',
  default: generateEmptyIncomes()
});

export default incomesAtom;
