import {useCallback, useEffect, useRef} from 'react';
import {Box, IconButton, InputBase, Paper, styled} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {useIntl} from 'react-intl';
import KeyCodes from '../../../@core/utilities/KeyCodes';
import {useRouter} from 'next/router';
import {objectFilter} from '../../../@core/utilities/helpers';

const PREFIX = 'PartnersSection';

const classes = {
  paperSearch: `${PREFIX}-paperSearch`,
};

const StyledBox = styled(Box)(({theme}) => ({
  marginBottom: '15px',
}));

const urlParamsUpdate = (router: any, params: any) => {
  router.push(
    {
      pathname: router.pathname,
      query: params,
    },
    undefined,
    {shallow: true},
  );
};

const BlogAndSuccessStoriesFilter = ({setApiFilters}: any) => {
  const {messages} = useIntl();
  const searchFieldRef = useRef<any>();
  const router = useRouter();

  useEffect(() => {
    if (router.query?.title) {
      setApiFilters((prev: any) => {
        return {
          ...prev,
          title: (router.query?.title as string) ?? '',
        };
      });
    }
  }, [router.query]);

  const onSearchClick = useCallback((e) => {
    if (e.keyCode && e.keyCode !== KeyCodes.ENTER) {
      return false;
    }
    setApiFilters((prev: any) => {
      return objectFilter({
        ...prev,
        title: searchFieldRef.current?.value,
      });
    });
    urlParamsUpdate(router, {title: searchFieldRef.current?.value});
  }, []);

  return (
    <StyledBox>
      <Paper className={classes.paperSearch}>
        <InputBase
          sx={{ml: 1, flex: 1, paddingLeft: '20px'}}
          placeholder={messages['common.search'] as string}
          inputProps={{'aria-label': 'Search'}}
          inputRef={searchFieldRef}
          onKeyDown={onSearchClick}
        />
        <IconButton
          sx={{p: '10px'}}
          aria-label='search'
          onClick={onSearchClick}>
          <SearchIcon aria-label='search' />
        </IconButton>
      </Paper>
    </StyledBox>
  );
};

export default BlogAndSuccessStoriesFilter;
