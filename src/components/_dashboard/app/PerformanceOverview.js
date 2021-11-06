import { merge, sum, max, flatten } from 'lodash';
import { format } from 'date-fns';
import ReactApexChart from 'react-apexcharts';
import { useRecoilValue } from 'recoil';

// material
import { Card, CardHeader, Box } from '@mui/material';
//
import { BaseOptionChart } from '../../charts';
import { fPercent } from '../../../utils/formatNumber';
import { generateLastNdates } from '../../../utils/formatTime';
import { incomesAtom, accountAtom } from '../../../recoil/atoms';

// ----------------------------------------------------------------------

const lastWeekDates = generateLastNdates(7, 'MM/dd/yyyy').reverse();

const getIncomeForDate = (incomes, date) => {
  const incomeList = incomes[format(new Date(date), 'MM/dd/yyyy')];
  return sum(incomeList?.map((inc) => JSON.parse(inc?.income)));
};

const getIncomeOfWeek = (incomes, isRounded = false) => {
  const incomeOfWeek = lastWeekDates.map((date) => getIncomeForDate(incomes, date));

  return isRounded
    ? incomeOfWeek.map((inc) => Math.round(inc))
    : incomeOfWeek.map((inc) => parseFloat(inc.toFixed(2)));
};

const getBalanceLastWeek = (incomes, balance) => {
  let sumIncome = 0;
  const balances = [];

  const incomeOfWeek = getIncomeOfWeek(incomes).reverse();

  incomeOfWeek.forEach((inc, i) => {
    sumIncome += inc;
    balances.push(Math.round(balance - sumIncome + incomeOfWeek[i]));
  });

  return balances.reverse();
};

const PerformanceOverview = () => {
  const incomes = useRecoilValue(incomesAtom);
  const account = useRecoilValue(accountAtom);

  const profitLastWeek = sum(
    flatten(Object.values(incomes))?.map((inc) => JSON.parse(inc?.income))
  );

  const { totalCrossWalletBalance = 0 } = account;
  const balance = JSON.parse(totalCrossWalletBalance);
  const increasePercent =
    (balance > 0 && profitLastWeek && (profitLastWeek / (balance - profitLastWeek)) * 100) || 0;

  const balancesOfLastWeek = getBalanceLastWeek(incomes, balance);
  const weekIncome = getIncomeOfWeek(incomes, true);

  const chartOptions = merge(BaseOptionChart(), {
    stroke: { width: [0, 2, 3] },
    plotOptions: { bar: { columnWidth: '11%', borderRadius: 4 } },
    fill: { type: ['solid', 'gradient', 'solid'] },
    labels: lastWeekDates,
    xaxis: { type: 'datetime' },
    yaxis: [
      {
        seriesName: 'Income',
        opposite: true,
        title: 'Income',
        min: 0,
        max: max(weekIncome) * 2,
        forceNiceScale: true
      },
      {
        seriesName: 'Balance',
        min: Math.round(balancesOfLastWeek[0] * 0.99),
        max: Math.round(balancesOfLastWeek[balancesOfLastWeek.length - 1] * 1.01),
        forceNiceScale: true,
        title: 'Balance'
      }
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `$${y.toFixed(1)}`;
          }
          return y;
        }
      }
    }
  });

  const CHART_DATA = [
    {
      name: 'Income',
      type: 'column',
      data: weekIncome
    },
    {
      name: 'Balance',
      type: 'area',
      data: balancesOfLastWeek
    }
  ];

  return (
    <Card>
      <CardHeader
        title="Performance Overview"
        subheader={`${fPercent(increasePercent, '0.00%')} last 7 days`}
      />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart type="line" series={CHART_DATA} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
};

export default PerformanceOverview;
