import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { format } from 'date-fns';

// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/charts/BaseOptionChart';
// recoil and services
import { accountAtom, incomesAtom, tradesAtom, updateTimeAtom } from './recoil/atoms';
import { getTradesOfTheWeek, getUserTradesOfTheDay } from './services/tradesServices';
import { getIncomesOfTheWeek, getUserIncomesOfTheDay } from './services/incomeServices';
import { getUserAccount } from './services/accountServices';

// ----------------------------------------------------------------------

const INTERVAL_FETCH = 60000; // 1 minute

const App = () => {
  const [intervalId, setIntervalId] = useState();

  const setTradesRecoil = useSetRecoilState(tradesAtom);
  const setIncomesRecoil = useSetRecoilState(incomesAtom);
  const setAccountRecoil = useSetRecoilState(accountAtom);
  const setUpdateTimeRecoil = useSetRecoilState(updateTimeAtom);

  const getDailyData = () => {
    getUserAccount().then((account) => setAccountRecoil(account));
    getUserTradesOfTheDay().then((trades) =>
      setTradesRecoil((oldTrades) => ({
        ...oldTrades,
        [format(new Date(), 'MM/dd/yyyy')]: trades
      }))
    );
    getUserIncomesOfTheDay().then((incomes) =>
      setIncomesRecoil((oldIncomes) => ({
        ...oldIncomes,
        [format(new Date(), 'MM/dd/yyyy')]: incomes
      }))
    );

    setUpdateTimeRecoil(new Date());
    console.log('Updating your daily data... time: ', new Date());
  };

  const periodicallyFetchDailyData = () => {
    const id = setInterval(getDailyData, INTERVAL_FETCH);
    setIntervalId(id);
  };

  useEffect(() => {
    console.log('Fetching your weekly data');

    getTradesOfTheWeek().then((trades) => setTradesRecoil(trades));
    getIncomesOfTheWeek().then((incomes) => setIncomesRecoil(incomes));
    getUserAccount().then((account) => setAccountRecoil(account));
    setUpdateTimeRecoil(new Date());

    periodicallyFetchDailyData();
    return () => clearInterval(intervalId);
  }, []);

  return (
    <ThemeConfig>
      <ScrollToTop />
      <GlobalStyles />
      <BaseOptionChartStyle />
      <Router />
    </ThemeConfig>
  );
};

export default App;
