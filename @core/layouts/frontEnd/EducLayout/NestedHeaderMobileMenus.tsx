import React, {useState} from 'react';
import {useIntl} from 'react-intl';
import MenuItem from '@mui/material/MenuItem';
import {classes} from '../IndustryDefaultLayout/Header.style';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Collapse, List} from '@mui/material';
import {NavLink as Link} from '../../../elements/common';

interface NestedHeaderMobileMenusProps {
  items: any[];
  title: string;
  onClick?: () => void;
}

const NestedHeaderMobileMenus = ({
  items,
  title,
  onClick,
}: NestedHeaderMobileMenusProps) => {
  const [open, setOpen] = useState(false);

  const {messages} = useIntl();

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  return (
    <React.Fragment>
      <MenuItem onClick={handleClick} className={classes.menuItemMobile}>
        <span>{title}</span>
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </MenuItem>
      <Collapse in={open} timeout='auto' unmountOnExit>
        <List
          component='div'
          disablePadding
          sx={{
            marginLeft: '10px',
            borderLeft: '2px solid rgba(82, 82, 84, 0.5)',
          }}>
          {items.map((child: any, key: any) => (
            <Link key={key} href={child.href}>
              <MenuItem
                component='span'
                className={classes.menuItemMobile}
                onClick={() => {
                  if (onClick) {
                    onClick();
                  }
                  handleClick();
                }}>
                {messages[child.messageKey]}
              </MenuItem>
            </Link>
          ))}
        </List>
      </Collapse>
    </React.Fragment>
  );
};

export default NestedHeaderMobileMenus;
