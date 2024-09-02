import {KeyboardArrowDown, Login} from '@mui/icons-material';
import {
  Button,
  Card,
  ListItemIcon,
  ListItemText,
  MenuItem,
} from '@mui/material';
import Box from '@mui/material/Box';
import {ButtonProps} from '@mui/material/Button/Button';
import React, {useCallback, useState} from 'react';
import {useIntl} from 'react-intl';
import {getCDAPSSOUrl} from '../../../common/CDAPConfig';
import {getSSOLoginUrl} from '../../../common/SSOConfig';
import Divider from '../../../components/Divider/Divider';
import {SMEFDomains} from '../../../utilities/helpers';
import {Link} from '../../common';

interface Props extends ButtonProps {
  onClick: () => void;
  buttonText: string;
  icon: React.ReactNode;
}

const GotoSignInOrUpMenu = ({onClick, buttonText, icon, ...extra}: Props) => {
  const {messages} = useIntl();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);
  const isSMEF =
    window && SMEFDomains.includes(String(window.location.hostname));

  return (
    <Box sx={{whiteSpace: 'nowrap'}}>
      {isSMEF ? (
        <Link
          href={getSSOLoginUrl({
            redirected_from: window?.location?.href,
          })}>
          <Button
            sx={{height: '100%'}}
            id='my-profile-button'
            variant='contained'
            aria-label={messages['common.login'] as string}
            aria-controls='nested-menu'
            aria-expanded={open ? 'true' : undefined}
            role='button'
            aria-haspopup='true'
            startIcon={<Login />}
            disableElevation>
            {messages['common.login'] as string}
          </Button>
        </Link>
      ) : (
        <Button
          sx={{height: '100%'}}
          id='my-profile-button'
          aria-label={messages['common.registration_login'] as string}
          aria-controls='nested-menu'
          aria-expanded={open ? 'true' : undefined}
          role='button'
          aria-haspopup='true'
          variant='contained'
          disableElevation
          onClick={handleClick}
          endIcon={<KeyboardArrowDown />}>
          {messages['common.registration_login'] as string}
        </Button>
      )}
      {open && (
        <Card
          id='my-profile-menu'
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
            <MenuItem tabIndex={0} onClick={onClick}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText>{buttonText}</ListItemText>
            </MenuItem>

            <Divider sx={{margin: '0 !important'}} />

            <Link href={getSSOLoginUrl()}>
              <MenuItem>
                <ListItemIcon>
                  <Login />
                </ListItemIcon>
                <ListItemText>{messages['common.login']}</ListItemText>
              </MenuItem>
            </Link>
            <Divider sx={{margin: '0 !important'}} />
            <Link href={getCDAPSSOUrl()}>
              <MenuItem>
                <ListItemIcon>
                  <Login />
                </ListItemIcon>
                <ListItemText>{messages['common.cdap_login']}</ListItemText>
              </MenuItem>
            </Link>
          </button>
        </Card>
      )}
      {open && (
        <div
          title={messages['menu_button.accessibility_close_message'] as string}
          tabIndex={0}
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

export default GotoSignInOrUpMenu;
