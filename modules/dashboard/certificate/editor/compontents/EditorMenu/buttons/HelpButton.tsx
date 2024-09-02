import * as React from 'react';

import {
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  Slide,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import {FiHelpCircle, FiX} from 'react-icons/fi';
import {BsKeyboard} from 'react-icons/bs';
import {TransitionProps} from '@mui/material/transitions';
import Button from './../../ui/Button';

const theme = createTheme({
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          width: '600px',
          backgroundColor: '#111827',
          color: 'white',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '.25rem',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          position: 'absolute',
          bottom: '0.25rem',
          left: '3.25rem',
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(131 ,131 ,131 ,0.5)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          backgroundColor: 'white',
          padding: '4px',
          marginRight: '4px',
          marginTop: '2px',
          '&:hover': {
            backgroundColor: '#adbfce',
          },
        },
      },
    },
  },
});

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction='right' ref={ref} {...props} />;
});

export default function AlertDialogSlide() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={'help-button'}>
        <Button
          type={'secondary'}
          onClick={handleClickOpen}
          icon={FiHelpCircle}
          className={'help-button-inner'}></Button>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby='alert-dialog-slide-description'>
          <DialogActions>
            <IconButton onClick={handleClose}>
              <FiX
                stroke='black'
                style={{
                  width: '1.5rem',
                  height: '1.5rem',
                }}
              />
            </IconButton>
          </DialogActions>
          <DialogContent sx={{padding: '5px 6px'}}>
            <h3 className='dialog-header'>
              <BsKeyboard />
              Keyboard Shortcut
            </h3>
            <div className='dialog-item-container'>
              <div className='dialog-item-box'>
                <div className='help-item-container'>
                  <div className='keyboard-button'>
                    <kbd>Ctrl</kbd> + <kbd>I</kbd>
                  </div>
                  <div className='keyboard-button-action'>- Zoom Out</div>
                </div>
                <div className='help-item-container'>
                  <div className='keyboard-button'>
                    <kbd>Ctrl</kbd> + <kbd>D</kbd>
                  </div>
                  <div className='keyboard-button-action'>- Zoom In</div>
                </div>
                <div className='help-item-container'>
                  <div className='keyboard-button'>
                    <kbd>Ctrl</kbd> + <kbd>F</kbd>
                  </div>
                  <div className='keyboard-button-action'> - Fit To Screen</div>
                </div>

                <div className='help-item-container'>
                  <div className='keyboard-button'>
                    <kbd>Ctrl</kbd> + <kbd>Z</kbd>
                  </div>
                  <div className='keyboard-button-action'> - Undo</div>
                </div>

                <div className='help-item-container'>
                  <div className='keyboard-button'>
                    <kbd>Ctrl</kbd> + <kbd>Y</kbd>
                  </div>
                  <div className='keyboard-button-action'> - Redo</div>
                </div>
                <div className='help-item-container'>
                  <div className='keyboard-button'>
                    <kbd>Delete</kbd>
                  </div>
                  <div className='keyboard-button-action'>
                    {' '}
                    - Delete Element
                  </div>
                </div>
              </div>
              <div className='dialog-item-box'>
                <div className='help-item-container'>
                  <div className='keyboard-button'>
                    <kbd>Ctrl</kbd> + <kbd>&#x2192;</kbd>
                  </div>
                  <div className='keyboard-button-action'>
                    {' '}
                    - Move Element To Right
                  </div>
                </div>
                <div className='help-item-container'>
                  <div className='keyboard-button'>
                    <kbd>Ctrl</kbd> + <kbd>&#x2190;</kbd>
                  </div>
                  <div className='keyboard-button-action'>
                    {' '}
                    - Move Element To Left
                  </div>
                </div>
                <div className='help-item-container'>
                  <div className='keyboard-button'>
                    <kbd>Ctrl</kbd> + <kbd>&#x2191;</kbd>
                  </div>
                  <div className='keyboard-button-action'>
                    {' '}
                    - Move Element To Top
                  </div>
                </div>
                <div className='help-item-container'>
                  <div className='keyboard-button'>
                    <kbd>Ctrl</kbd> + <kbd> &#x2193;</kbd>
                  </div>
                  <div className='keyboard-button-action'>
                    {' '}
                    - Move Element To Down
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}
