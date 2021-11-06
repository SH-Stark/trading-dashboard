import { merge, sum, orderBy, flatten } from 'lodash';
import ReactApexChart from 'react-apexcharts';
import { useRecoilValue } from 'recoil';

// material
import { Box, Card, CardHeader } from '@mui/material';
// utils
import { fCurrency } from '../../../utils/formatNumber';
//
import { BaseOptionChart } from '../../charts';
import { incomesAtom } from '../../../recoil/atoms';

// ----------------------------------------------------------------------

const TopPerformers = () => {
  const incomes = useRecoilValue(incomesAtom);

  const pnlRepartition = {};

  flatten(Object.values(incomes))?.forEach((inc) => {
    pnlRepartition[inc?.symbol] = (pnlRepartition[inc?.symbol] || 0) + JSON.parse(inc?.income);
  });

  const orderedPerformers = orderBy(
    Object.keys(pnlRepartition).map((key) => ({ label: key, value: pnlRepartition[key] })),
    'value',
    'desc'
  );

  return (
    <Card>
      <CardHeader
        title="Top Performers"
        subheader={`+${fCurrency(sum(orderedPerformers.map((o) => o.value)))} last 7 days`}
      />
      <Box sx={{ mx: 3 }} dir="ltr">
        <Content orderedPerformers={orderedPerformers} />
      </Box>
    </Card>
  );
};

const Content = ({ orderedPerformers }) => {
  const chartOptions = merge(BaseOptionChart(), {
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (seriesName) => fCurrency(seriesName),
        title: {
          formatter: () => 'Last 7 days: '
        }
      }
    },
    plotOptions: {
      bar: { horizontal: true, barHeight: '28%', borderRadius: 2 }
    },
    xaxis: {
      categories: orderedPerformers.map((o) => o.label)
    }
  });

  const CHART_DATA = [{ data: orderedPerformers.map((o) => o.value) }];

  return <ReactApexChart type="bar" series={CHART_DATA} options={chartOptions} height={364} />;
};

export default TopPerformers;
