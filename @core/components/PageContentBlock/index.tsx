import React, {ReactNode} from 'react';
import {styled} from '@mui/material/styles';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from '@mui/material';

const PREFIX = 'PageContentBlock';

const classes = {
  pageTitle: `${PREFIX}-pageTitle`,
};

const StyledCard = styled(Card)(({theme}): any => ({
  height: 'calc(100vh - 70px)',
  [`${theme.breakpoints.down('md')}`]: {
    height: 'calc(100vh - 75px)',
  },
  [`${theme.breakpoints.down('sm')}`]: {
    height: 'auto',
    minHeight: 'calc(100vh - 75px)',
  },
  [`& .${classes.pageTitle}`]: {
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      marginRight: '12px',
    },
  },
  ['& .MuiCardHeader-root']: {
    //padding: '10px 22px 10px 16px',
    ['& .MuiCardHeader-action']: {
      marginTop: '-2px',
    },
  },
}));

interface PageContentBlockProps {
  title?: string | ReactNode;
  sidebarContent?: ReactNode;
  fullView?: boolean;
  cardStyle?: any;
  children: ReactNode;
  extra?: ReactNode;
}

const PageContentBlock: React.FC<PageContentBlockProps> = ({
  children,
  title,
  extra,
}) => {
  return (
    <StyledCard>
      <CardHeader
        title={
          title && (
            <Box style={{display: 'flex', alignItems: 'center'}}>
              <Typography variant={'h6'} className={classes.pageTitle}>
                {title}
              </Typography>
            </Box>
          )
        }
        action={
          extra && (
            <Box
              display='flex'
              flexDirection='row'
              alignItems='center'
              ml='auto'>
              {extra}
            </Box>
          )
        }
      />
      <Divider />
      <CardContent
        sx={{
          p: {
            xs: '5px !important',
            sm: '5px 5px 15px 5px !important',
            md: '5px 5px 15px 5px !important',
            lg: '5px 5px 15px 5px !important',
            xl: '5px 5px 15px 5px !important',
          },
          height: {
            xs: 'auto',
            sm: 'calc(100% - 75px)',
            md: 'calc(100% - 65px)',
          },
        }}>
        <div style={{margin: '10px', height: '100%'}}>{children}</div>
      </CardContent>
    </StyledCard>
  );
};

export default React.memo(PageContentBlock);
