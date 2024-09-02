import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import {useIntl} from 'react-intl';
import {NavLink as Link} from '../../../elements/common';
import {styled} from '@mui/material/styles';
import {Box, Card, ListItemText, Stack} from '@mui/material';
import {KeyboardArrowDown} from '@mui/icons-material';
import Divider from '../../../components/Divider/Divider';

const StyledNestedBtn = styled(Stack)(({theme}) => ({
  fontSize: '1.12rem',
  height: '100%',
  '&:hover': {
    transition: 'all .7s ease',
    transform: 'scale(1.2)',
    cursor: 'pointer',
  },
  '& .active': {
    fontWeight: 'bold',
    background: 'none',
  },
}));

interface NestedHeaderMenusProps {
  buttonTitle: string;
  subMenus: any[];
}

const NestedHeaderMenus = ({buttonTitle, subMenus}: NestedHeaderMenusProps) => {
  const {messages} = useIntl();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{whiteSpace: 'nowrap'}}>
      <StyledNestedBtn
        aria-controls={open ? 'nested-menu' : undefined}
        aria-haspopup='true'
        aria-label={messages[buttonTitle] as string}
        aria-expanded={open ? 'true' : undefined}
        role='button'
        direction={'row'}
        tabIndex={0}
        onClick={handleClick}>
        {messages[buttonTitle]}
        <KeyboardArrowDown />
      </StyledNestedBtn>

      {open && (
        <Card
          sx={{
            position: 'absolute',
            marginTop: '10px',
            boxShadow:
              '0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%)',
            zIndex: 9999999,
          }}>
          {/** CAN NOT USE ANYTHING OTHER THAN button */}
          <button
            tabIndex={-1}
            style={{
              background: 'none',
              padding: 0,
              margin: 0,
              border: 0,
              outline: 0,
              appearance: 'none',
              textAlign: 'unset',
            }}>
            {subMenus?.map((menu, index) => (
              <Link
                href={menu?.href}
                key={index}
                target={menu?.isOpenNewTab ? '_blank' : '_self'}>
                <MenuItem>
                  <ListItemText>{messages[menu?.messageKey]}</ListItemText>
                </MenuItem>
                {index !== subMenus?.length - 1 && (
                  <Divider sx={{margin: '0 !important'}} />
                )}
              </Link>
            ))}
          </button>
        </Card>
      )}
      {open && (
        <div
          title={`${messages[buttonTitle]} ${
            messages['menu_button.accessibility_close_message'] as string
          }`}
          style={{
            background: '#8880',
            position: 'fixed',
            zIndex: 999999,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          onClick={() => handleClose()}
          onWheel={() => handleClose()}>
          {''}
        </div>
      )}
    </Box>
  );
};

export default NestedHeaderMenus;
