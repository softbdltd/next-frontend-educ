import * as React from 'react';
import TextField from '@mui/material/TextField';
import DateRangePicker, {DateRange} from '@mui/lab/DateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Box from '@mui/material/Box';

const CustomDateRangePicker: any = () => {
  const [value, setValue] = React.useState<DateRange<Date | null>>([
    null,
    null,
  ]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateRangePicker
        startText='Check-in'
        endText='Check-out'
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
        }}
        renderInput={(startProps, endProps) => (
          <React.Fragment>
            <TextField {...startProps} />
            <Box sx={{mx: 2}}> To </Box>
            <TextField {...endProps} />
          </React.Fragment>
        )}
      />
    </LocalizationProvider>
  );
};
export default CustomDateRangePicker;
