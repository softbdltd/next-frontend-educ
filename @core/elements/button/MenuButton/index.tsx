import {Link} from '../../common';
import {Button, Menu, MenuItem, MenuProps} from '@mui/material';
import {alpha, styled} from '@mui/material/styles';
import React, {useState} from 'react';
import {KeyboardArrowDown} from '@mui/icons-material';
import ConfirmationButton from '../ConfirmationButton';

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({theme}) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light'
        ? 'rgb(55, 65, 81)'
        : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

type targetType = '_self' | '_blank' | '_parent' | '_top';

interface IMenuItem {
  messageKey?: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: any;
  href?: string;
  target?: targetType;
}

interface MenuButtonProps {
  items: Array<IMenuItem>;
  buttonText: string;
  buttonProps?: any;
  containerStyle?: any;
  hideAfterClick?: boolean;
  hasConfirmButton?: boolean;
}

const MenuButton = ({
  items,
  buttonText,
  buttonProps = {},
  containerStyle = {},
  hideAfterClick = false,
  hasConfirmButton = false,
}: MenuButtonProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{...containerStyle}}>
      <Button
        id='custom-menu-button'
        aria-controls={open ? 'custom-menu-button' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        variant='contained'
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDown />}
        {...buttonProps}>
        {buttonText}
      </Button>
      <StyledMenu
        id='custom-button-menu'
        MenuListProps={{
          'aria-labelledby': 'custom-button-menu',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiMenu-paper': {
            '& .MuiMenuItem-root:not(:last-of-type)': {
              borderBottom: '1px solid #e9e9e9',
            },
          },
        }}>
        {items.map((item, index) => {
          return item?.href ? (
            <Link
              href={item?.href}
              passHref={true}
              key={index}
              target={item?.target ?? '_self'}>
              <MenuItem
                onClick={(event) => {
                  if (item?.onClick) item.onClick(event);
                  if (hideAfterClick) {
                    handleClose();
                  }
                }}>
                {item?.icon}
                {item.label}
              </MenuItem>
            </Link>
          ) : hasConfirmButton && item.onClick ? (
            <ConfirmationButton
              key={index}
              buttonType={'approve'}
              confirmAction={item?.onClick}
              buttonIcon={item?.icon}
              labelMessageKey={item?.messageKey ?? item.label}
              sx={{width: '100%', justifyContent: 'flex-start'}}
            />
          ) : (
            <MenuItem
              onClick={(event) => {
                if (item?.onClick) item.onClick(event);
              }}
              key={index}>
              {item?.icon}
              {item.label}
            </MenuItem>
          );
        })}
      </StyledMenu>
    </div>
  );
};

export default MenuButton;
