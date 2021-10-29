import { merge, isEmpty } from 'lodash';
import ReactApexChart from 'react-apexcharts';
import { useRecoilValue } from 'recoil';

// material
import { useTheme, styled } from '@mui/material/styles';
import { Card, CardHeader, CircularProgress } from '@mui/material';
// utils
import { fNumber } from '../../../utils/formatNumber';
//
import { BaseOptionChart } from '../../charts';
import { accountAtom } from '../../../recoil/atoms';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 410;
const LEGEND_HEIGHT = 108;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(3),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible'
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`
  }
}));

// ----------------------------------------------------------------------

const PositionsRepartition = () => {
  const account = useRecoilValue(accountAtom);

  return (
    <Card>
      <CardHeader title="Positions Repartition" />
      <ChartWrapperStyle dir="ltr">
        {isEmpty(account) ? (
          <CircularProgress />
        ) : (
          <PieChart accountPositions={account?.positions} />
        )}
      </ChartWrapperStyle>
    </Card>
  );
};
const PieChart = ({ accountPositions }) => {
  const theme = useTheme();

  const positions = accountPositions?.filter((pos) => pos.positionAmt > 0);

  const chartOptions = merge(BaseOptionChart(), {
    labels: positions?.map((p) => p.symbol),
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: 'center' },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: (seriesName) => `#${seriesName}`
        }
      }
    },
    plotOptions: {
      pie: { donut: { labels: { show: false } } }
    }
  });

  return (
    <ReactApexChart
      type="pie"
      series={positions?.map((p) => JSON.parse(p.positionInitialMargin))}
      options={chartOptions}
      height={280}
    />
  );
};

export default PositionsRepartition;
