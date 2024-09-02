import React from 'react';
import {Button} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import ButtonSkeleton from '../../display/skeleton/ButtonSkeleton/ButtonSkeleton';
import {useIntl} from 'react-intl';
import {styled} from '@mui/material/styles';
import {ThemeMode} from '../../../../shared/constants/AppEnums';

interface Props {
  onClick?: () => void;
  className?: string;
  label?: string;
  isLoading?: boolean;
}

const UnstyledCancelButton = ({
  onClick,
  className,
  label,
  isLoading,
}: Props) => {
  const {messages} = useIntl();
  const btnText = label ? label : messages['common.cancel'];
  return isLoading ? (
    <ButtonSkeleton />
  ) : (
    <Button
      startIcon={<CancelIcon />}
      variant='outlined'
      onClick={onClick}
      className={className}>
      {btnText}
    </Button>
  );
};

const CancelButton = styled(UnstyledCancelButton)(({theme}) => ({
  background:
    theme.palette.mode === ThemeMode.DARK
      ? theme.palette.grey['700']
      : theme.palette.grey['200'],
  border:
    '1px solid ' +
    (theme.palette.mode === ThemeMode.DARK
      ? theme.palette.grey['700']
      : theme.palette.grey['400']),
  color:
    theme.palette.mode === ThemeMode.DARK
      ? theme.palette.grey['100']
      : theme.palette.grey['700'],
  '&:hover': {
    border:
      '1px solid ' +
      (theme.palette.mode === ThemeMode.DARK
        ? theme.palette.grey['700']
        : theme.palette.grey['400']),
    color:
      theme.palette.mode === ThemeMode.DARK
        ? theme.palette.grey['100']
        : theme.palette.grey['800'],
  },
  [theme.breakpoints.down('md')]: {
    paddingTop: '4px !important',
    paddingBottom: '4px !important',
  },
}));
export default React.memo(CancelButton);
