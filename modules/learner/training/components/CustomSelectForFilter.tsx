import {FormControl, InputLabel, MenuItem, Select} from '@mui/material';
import React from 'react';
import {useIntl} from 'react-intl';
import {styled} from '@mui/material/styles';

const PREFIX = 'CustomSelectForFilter';
const classes = {
  selectStyle: `${PREFIX}-selectStyle`,
};

const StyledFormControl = styled(FormControl)(({theme}) => ({
  [`& .${classes.selectStyle}`]: {
    background: '#fff',
    '& .MuiSelect-select': {
      padding: '10px 30px 10px 15px',
    },
  },
}));

interface CustomSelectForFilterProps {
  id: string;
  labelId: string;
  selectedOptionId: number;
  defaultLabel: string;
  onChangeCallback: (e: any) => void;
  options?: Array<any>;
}

const CustomSelectForFilter = ({
  id,
  labelId,
  selectedOptionId,
  defaultLabel,
  onChangeCallback,
  options,
}: CustomSelectForFilterProps) => {
  const {messages} = useIntl();

  return (
    <>
      <StyledFormControl variant='outlined' fullWidth={true} size={'small'}>
        <InputLabel sx={{background: '#fff', borderRadius: '3px'}} id={labelId}>
          {defaultLabel}
        </InputLabel>
        <Select
          id={id}
          labelId={labelId}
          label={defaultLabel}
          value={selectedOptionId}
          className={classes.selectStyle}
          onChange={onChangeCallback}>
          <MenuItem value=''>
            <em>{messages['common.select']}</em>
          </MenuItem>
          {options &&
            options.map((option: any) => {
              return (
                <MenuItem key={option.id} value={option.id}>
                  {option.title}
                </MenuItem>
              );
            })}
        </Select>
      </StyledFormControl>
    </>
  );
};

export default CustomSelectForFilter;
