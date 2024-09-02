import {
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Fonts } from '../../../shared/constants/AppEnums';

interface KeyboardShortcutPopupProps {
  popupOpen: boolean;
  handlePopupClose: () => void;
}

const keyboardShortcuts = [
  {
    action: 'Open Accessibility Toolbar',
    shortcut: '[ Alt + / ]',
    ariaLabel: 'keyboard alt plus keyboard forward slash',
  },
  {
    action: 'Skip to content',
    shortcut: '[ Alt + A ]',
    ariaLabel: 'keyboard alt plus keyboard A',
  },
  {
    action: 'Open Keyboard Shortcut',
    shortcut: '[ Alt + K ]',
    ariaLabel: 'keyboard alt plus keyboard K',
  },
  {
    action: 'Go to jobs',
    shortcut: '[ Alt + M ]',
    ariaLabel: 'keyboard alt plus keyboard M',
  },
  {
    action: 'Go to Skills',
    shortcut: '[ Alt + N ]',
    ariaLabel: 'keyboard alt plus keyboard N',
  },
  {
    action: 'Go to news',
    shortcut: '[ Alt + L ]',
    ariaLabel: 'keyboard alt plus keyboard L',
  },
  {
    action: 'Go to partners',
    shortcut: '[ Alt + o ]',
    ariaLabel: 'keyboard alt plus keyboard O',
  },
  {
    action: 'Go to home',
    shortcut: '[ Alt + J ]',
    ariaLabel: 'keyboard alt plus keyboard J',
  },
];

const KeyboardShortcutPopup = ({
  popupOpen,
  handlePopupClose,
}: KeyboardShortcutPopupProps) => {
  return (
    <Dialog maxWidth={'lg'} open={popupOpen} onClose={handlePopupClose}>
      <DialogTitle tabIndex={0}>Keyboard Shortcut List</DialogTitle>
      <DialogContent>
        <TableContainer>
          <Table aria-label='Keyboard Shortcut table'>
            <TableHead>
              <TableRow>
                <TableCell tabIndex={0} sx={{fontWeight: Fonts.BOLD}}>
                  Action
                </TableCell>
                <TableCell
                  tabIndex={0}
                  sx={{fontWeight: Fonts.BOLD}}
                  align='right'>
                  Shortcut
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {keyboardShortcuts.map((row) => (
                <TableRow
                  key={row.action}
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                  <TableCell tabIndex={0} component='th' scope='row'>
                    {row.action}
                  </TableCell>
                  <TableCell
                    aria-label={row?.ariaLabel}
                    tabIndex={0}
                    align='right'>
                    {row.shortcut}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={handlePopupClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default KeyboardShortcutPopup;
