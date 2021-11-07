// material
import { styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';

const SummaryBox = ({ total = 0, color = '', backgroundColor = '', text = '', subText = '' }) => {
  const RootStyle = styled(Card)(({ theme }) => ({
    boxShadow: 'none',
    textAlign: 'center',
    padding: theme.spacing(subText ? 1.5 : 3, 0),
    color: theme.palette[color].darker,
    backgroundColor: theme.palette[backgroundColor].lighter
  }));

  return (
    <RootStyle>
      {subText && (
        <Typography variant="overline" sx={{ opacity: 0.72 }}>
          {subText}
        </Typography>
      )}

      <Typography variant="h3">{total}</Typography>

      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        {text}
      </Typography>
    </RootStyle>
  );
};

export default SummaryBox;
