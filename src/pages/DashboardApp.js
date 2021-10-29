// material
import { Grid, Container } from '@mui/material';

// components
import Page from '../components/Page';
import {
  // AppTasks,
  // AppNewsUpdate,
  LastOrders,
  PositionsRepartition,
  PerformanceOverview,
  // AppTrafficBySite,
  // AppCurrentSubject,
  TopPerformers
} from '../components/_dashboard/app';
import Summary from '../layouts/dashboard/Summary';

// ----------------------------------------------------------------------

const DashboardApp = () => (
  <Page title="Binance Futures Dashboard">
    <Container style={{ marginTop: 20 }} maxWidth="xl">
      {/* <Box sx={{ pb: 5 }}>
        <Typography variant="h4">Hi, Welcome back</Typography>
      </Box> */}
      <Grid container spacing={3}>
        <Summary />

        <Grid item xs={12} md={6} lg={8}>
          <PerformanceOverview />
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <PositionsRepartition />
        </Grid>

        <Grid item xs={12} md={6} lg={8}>
          <TopPerformers />
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <LastOrders />
        </Grid>

        {/* <Grid item xs={12} md={6} lg={4}>
          <AppCurrentSubject />
        </Grid> */}

        {/* <Grid item xs={12} md={6} lg={8}>
          <AppNewsUpdate news={news} />
        </Grid> */}

        {/* <Grid item xs={12} md={6} lg={4}>
          <AppTrafficBySite />
        </Grid>

        <Grid item xs={12} md={6} lg={8}>
          <AppTasks />
        </Grid> */}
      </Grid>
    </Container>
  </Page>
);

export default DashboardApp;
