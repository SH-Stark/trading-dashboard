import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Grid, Typography } from '@mui/material';
import { useRecoilValue } from 'recoil';

// material
import { styled } from '@mui/material/styles';
//
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';
import { fDateTime } from '../../utils/formatTime';
import { updateTimeAtom } from '../../recoil/atoms';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 16;
const APP_BAR_DESKTOP = 8;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const updateTime = useRecoilValue(updateTimeAtom);

  return (
    <RootStyle>
      <DashboardNavbar onOpenSidebar={() => setOpen(true)} />

      <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />

      <MainStyle>
        <Grid container justifyContent="center">
          <Grid item>
            <Typography variant="overline">Last update: {fDateTime(updateTime)}</Typography>
          </Grid>
        </Grid>
        <Outlet />
      </MainStyle>
    </RootStyle>
  );
}
