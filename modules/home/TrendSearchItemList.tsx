import React from 'react';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/material';

const PREFIX = 'TrendSearchItemList';

const classes = {
  trendSearchKey: `${PREFIX}-trendSearchKey`,
};

const SearchItemList = ({searchItems, className}: any) => {
  const listItems = searchItems.map((item: any, index: number) => (
    <Box className={classes.trendSearchKey} key={index}>
      {item}
    </Box>
  ));

  return (
    <Box display={'flex'} className={className}>
      {listItems}
    </Box>
  );
};

const StyledSearchItemList = styled(SearchItemList)(({theme}) => ({
  [`& .${classes.trendSearchKey}`]: {
    background: '#fff',
    textAlign: 'center',
    border: '1px solid #fff',
    borderRadius: '6px',
    padding: '5px 8px',
    marginRight: '8px',
  },
}));

const TrendSearchItemList = ({searchItems}: any) => {
  return <StyledSearchItemList searchItems={searchItems} />;
};

export default TrendSearchItemList;
