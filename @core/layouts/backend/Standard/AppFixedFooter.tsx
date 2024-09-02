import React, {useContext} from 'react';
import {styled} from '@mui/material/styles';
import AppContext from '../../../../@core/utility/AppContext';
import Box from '@mui/material/Box';
import {Button} from '@mui/material';
import AppContextPropsType from '../../../../redux/types/AppContextPropsType';

const PREFIX = 'AppFixedFooter';

const classes = {
  btnRoot: `${PREFIX}-btnRoot`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const StyledBox = styled(Box)(({theme}) => ({
  position: 'fixed',
  left: 'auto',
  bottom: 0,
  zIndex: 99,
  margin: '0',
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  [theme.breakpoints.up('lg')]: {
    width: 'calc(100vw - 19rem)',
  },
  [theme.breakpoints.up('xl')]: {
    width: 'calc(100vw - 21.6rem)',
  },
  '& .footerContainer': {
    padding: '5px 20px',
    [theme.breakpoints.up('md')]: {
      paddingLeft: 32,
      paddingRight: 32,
    },
    [theme.breakpoints.up('xl')]: {
      padding: '10px 32px',
    },
  },

  [`& .${classes.btnRoot}`]: {
    paddingLeft: 20,
    paddingRight: 20,
  },
}));

interface AppFixedFooterProps {
  props?: any;
}

const AppFixedFooter: React.FC<AppFixedFooterProps> = (props) => {
  const {footer, footerType} = useContext<AppContextPropsType>(AppContext);

  return (
    <>
      {footer && footerType === 'fixed' ? (
        <StyledBox className={'footer fixed-footer'}>
          <Box
            className='footerContainer'
            alignItems='center'
            flexDirection='row'
            display='flex'>
            <Box>Copy right @crema 2020</Box>
            <Box ml='auto'>
              <Button className={classes.btnRoot} color='primary'>
                Buy Now
              </Button>
            </Box>
          </Box>
        </StyledBox>
      ) : null}
    </>
  );
};

export default AppFixedFooter;
