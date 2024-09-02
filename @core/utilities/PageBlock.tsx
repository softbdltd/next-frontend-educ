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

const PREFIX = 'PageBlock';

const classes = {
  pageTitle: `${PREFIX}-pageTitle`,
  cardHeader: `${PREFIX}-cardHeader`,
};

const StyledCard = styled(Card)(({theme}): any => ({
  [`& .${classes.pageTitle}`]: {
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      marginRight: '12px',
    },
  },
  [`& .${classes.cardHeader}`]: {
    flexWrap: 'wrap',
    [`${theme.breakpoints.down('sm')}`]: {
      alignItems: 'flex-start',
      gap: '10px',
    },
  },
}));

interface PageBlockProps {
  title?: string | ReactNode;
  sidebarContent?: ReactNode;
  fullView?: boolean;
  cardStyle?: any;
  children: ReactNode;
  extra?: ReactNode;
}

const PageBlock: React.FC<PageBlockProps> = ({children, title, extra}) => {
  return (
    <StyledCard>
      <CardHeader
        className={classes.cardHeader}
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
      <CardContent sx={{pt: 0}}>
        <div style={{margin: '10px'}}>{children}</div>
      </CardContent>
    </StyledCard>
  );
};

export default React.memo(PageBlock);
