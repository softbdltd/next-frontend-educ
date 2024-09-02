import {useEffect, useState} from 'react';
import Popover from '@mui/material/Popover';
import {Box, Typography, IconButton} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckIcon from '@mui/icons-material/Check';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {DateRange, Range, RangeKeyDict} from 'react-date-range';
import {format} from 'date-fns';
import {MessageFormatElement} from 'react-intl';
import {getMomentDateFormat} from '../../utilities/helpers';
type Props = {
  id: {
    startDate: string;
    endDate: string;
  };
  label?: string | MessageFormatElement[];
  onChange: (value: any) => void;
  value: {
    startDate: string;
    endDate: string;
  };
  onDelete: () => void;
};

const initialState = [
  {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  },
];

const AditionalDateTimeRangeFilterField = ({
  id,
  label,
  value,
  onChange: onChangeCallback,
  onDelete: onDeleteCallback,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [isValueSelected, setIsValueSelected] = useState<any>(false);

  const [state, setState] = useState<Range[]>(initialState);
  useEffect(() => {
    if (value && value.startDate && value.endDate) {
      setSelectedDate({
        startDate: value.startDate,
        endDate: value.endDate,
      });
      setIsValueSelected(true);
    } else {
      setSelectedDate(null);
    }
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget.parentNode);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    setState(initialState);
    onDeleteCallback();
    setSelectedDate(null);
    setIsValueSelected(false);
  };

  const onDateRangeChange = (item: RangeKeyDict) => {
    setSelectedDate({
      startDate: format(item.selection.startDate!, 'yyyy-MM-dd'),
      endDate: format(item.selection.endDate!, 'yyyy-MM-dd'),
    });
    setState([item.selection as Range]);
  };

  const open = Boolean(anchorEl);

  return isValueSelected ? (
    <Box
      component='span'
      sx={{
        marginBottom: '10px',
        width: '260px',
        marginRight: '10px',
        display: 'inline-block',
      }}>
      <fieldset
        style={{
          width: '240px',
          display: 'inline-flex',
          justifyContent: 'space-between',
          border: '1px solid rgb(201 206 210)',
          borderRadius: '3px',
          marginTop: '-7px',
          padding: '0px 10px 2.5px 10px',
          marginLeft: '3px',
        }}>
        <legend
          style={{
            fontSize: '12px',
            fontWeight: '450',
            color: 'rgb(116, 120, 141)',
          }}>
          {label}
        </legend>
        <Typography sx={{color: '#484e4c', paddingTop: '3px'}}>
          {`${getMomentDateFormat(selectedDate?.startDate, 'Do MMM, YY')} - 
            ${getMomentDateFormat(selectedDate?.endDate, 'Do MMM, YY')}
          `}
        </Typography>
        <IconButton
          aria-label='delete'
          size='small'
          onClick={handleDeleteClick}>
          <HighlightOffIcon sx={{color: 'red'}} fontSize='inherit' />
        </IconButton>
      </fieldset>
    </Box>
  ) : (
    <>
      <Box
        component='div'
        sx={{
          marginBottom: '10px',
          width: '260px',
          mb: '10px',
          marginRight: '10px',
          display: 'inline-block',
        }}>
        <Box
          component='span'
          sx={{
            width: '240px',
            display: 'inline-flex',
            justifyContent: 'space-between',
            border: '1px solid rgb(201 206 210)',
            borderRadius: '3px',
            padding: '8.5px 10px 8.5px 12px',
            paddingTop: '2px',
          }}>
          <Typography sx={{color: '#858991', paddingTop: '3px'}}>
            {label}
          </Typography>
          <IconButton aria-label='delete' size='small' onClick={handleClick}>
            <CalendarMonthIcon
              sx={{color: 'rgb(201 206 210)'}}
              fontSize='inherit'
            />
          </IconButton>
        </Box>
      </Box>
      <Popover
        id={`${id?.startDate}- ${id?.endDate}`}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        sx={{marginTop: '10px'}}>
        <Box component='div' sx={{display: 'flex', flexDirection: 'column'}}>
          <DateRange
            initialFocusedRange={undefined}
            onChange={onDateRangeChange}
            moveRangeOnFirstSelection={false}
            ranges={state}
          />
          <div style={{display: 'flex', flexDirection: 'row-reverse'}}>
            <IconButton
              aria-label='confirm'
              size='large'
              sx={{padding: '2px'}}
              onClick={() => {
                if (selectedDate && selectedDate?.endDate) {
                  onChangeCallback(selectedDate);
                  setIsValueSelected(true);
                }
                handleClose();
              }}>
              <CheckIcon sx={{color: 'blue'}} fontSize='inherit' />
            </IconButton>
          </div>
        </Box>
      </Popover>
    </>
  );
};

export default AditionalDateTimeRangeFilterField;
