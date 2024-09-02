import React, {useCallback, useState} from 'react';
import {
  Button,
  Card,
  ListItemIcon,
  ListItemText,
  MenuItem,
} from '@mui/material';
import {Link} from '../../common';
import {KeyboardArrowDown, Logout} from '@mui/icons-material';
import {useIntl} from 'react-intl';
import {getSSOLogoutUrl} from '../../../common/SSOConfig';
import {ButtonProps} from '@mui/material/Button/Button';
import Box from '@mui/material/Box';
import Divider from '../../../components/Divider/Divider';

interface Props extends ButtonProps {
  onClick: () => void;
  buttonText: string;
  icon: React.ReactNode;
  cdapLogout?: boolean;
}

const GotoProfileMenu = ({
  onClick,
  buttonText,
  icon,
  cdapLogout,
  ...extra
}: Props) => {
  const {messages} = useIntl();
  // const dispatch = useDispatch();
  // const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <Box sx={{whiteSpace: 'nowrap'}}>
      <Button
        sx={{height: '100%'}}
        id='my-profile-button'
        aria-haspopup='true'
        aria-label={buttonText}
        aria-controls='nested-menu'
        aria-expanded={open ? 'true' : undefined}
        variant='contained'
        role='button'
        size={'small'}
        onClick={handleClick}
        endIcon={<KeyboardArrowDown />}>
        {buttonText}
      </Button>
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
            <Link>
              <MenuItem onClick={onClick}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText>{buttonText}</ListItemText>
              </MenuItem>
              <Divider sx={{margin: '0 !important'}} />
            </Link>

              <Link href={getSSOLogoutUrl()}>
              <MenuItem>
                <ListItemIcon>
                  <Logout />
                </ListItemIcon>
                <ListItemText>{messages['common.logout']}</ListItemText>
              </MenuItem>
            </Link>
          </button>
        </Card>
      )}
      {open && (
        <div
          title={messages['menu_button.accessibility_close_message'] as string}
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

export default GotoProfileMenu;
