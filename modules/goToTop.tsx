import {Container, Grid} from '@mui/material';
import {useEffect, useState} from 'react';
import {ArrowUpward} from '@mui/icons-material';

const GoToTop = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    let listener = () => {
      if (window.pageYOffset > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };
    window.addEventListener('scroll', listener);

    return () => {
      window.removeEventListener('scroll', listener);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({top: 0, left: 0});
  };
  return (
    <Container>
      {showButton && (
        <Grid
          item
          sx={{
            position: 'fixed',
            cursor: 'pointer',
            bottom: '9%',
            right: '8%',
            padding: '5px',
            margin: '30px auto',
            backgroundColor: 'primary.dark',
            height: ' 50px',
            width: '50px',
            borderRadius: '50%',
            transition: 'all 0.2s linear',
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
          }}>
          <div onClick={scrollToTop}>
            <ArrowUpward sx={{color: 'background.default', marginTop: '5px'}} />
          </div>
        </Grid>
      )}
    </Container>
  );
};

export default GoToTop;
