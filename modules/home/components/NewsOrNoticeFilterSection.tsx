import React from 'react';
import {Button, Grid} from '@mui/material';
import {useIntl} from 'react-intl';
import SearchIcon from '@mui/icons-material/Search';
import CustomDatePicker from '../../../@core/elements/input/CustomDatePicker';
import {SubmitHandler, useForm} from 'react-hook-form';
import {styled} from '@mui/material/styles';

const StyledGrid = styled(Grid)(({theme}) => ({
  justifyContent: 'center',
  [theme.breakpoints.up('md')]: {
    justifyContent: 'start',
  },
}));

const NewsOrNoticeFilterSection = ({setNoticeOrNewsFilter}: any) => {
  const {messages} = useIntl();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<any>();

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    setNoticeOrNewsFilter((prev: any) => {
      return {
        ...prev,
        ...data,
      };
    });
  };

  return (
    <StyledGrid container spacing={2}>
      <Grid item xs={5} md={4}>
        <CustomDatePicker
          id='published_at'
          label={messages['common.date']}
          control={control}
          errorInstance={errors}
        />
      </Grid>
      <Grid item>
        <Button
          onClick={handleSubmit(onSubmit)}
          sx={{p: {xs: '5.5px 16px', md: '7px 16px'}}}
          variant={'contained'}
          endIcon={<SearchIcon />}>
          {messages['common.search']}
        </Button>
      </Grid>
    </StyledGrid>
  );
};

export default NewsOrNoticeFilterSection;
