import React from 'react';
import {styled} from '@mui/material/styles';
import {Divider, ListItemText, MenuItem, MenuList, Paper} from '@mui/material';
import Link from 'next/link';

const PREFIX = 'YouthProfileNavigationSidebar';

const classes = {
  link: `${PREFIX}-link`
};

const StyledPaper = styled(Paper)((
  {
    theme
  }
) => {
  return {
    [`& .${classes.link}`]: {
      color: theme.palette.primary.dark,
      textDecoration: 'none',
    },
  };
});

const YouthProfileNavigationSidebar = () => {


  return (
    <StyledPaper>
      <MenuList>
        <MenuItem>
          <Link href={'../../learner-profile-edit/job-experience/null'}>
            <ListItemText>
              <a className={classes.link}>Personal Information</a>
            </ListItemText>
          </Link>
        </MenuItem>
        <Divider />
        <MenuItem>
          <Link href={'../../learner-profile-edit/education/null'}>
            <ListItemText>
              <a className={classes.link}>Education</a>
            </ListItemText>
          </Link>
        </MenuItem>
        <Divider />
        <MenuItem>
          <Link href={'../../learner-profile-edit/reference/null'}>
            <ListItemText>
              <a className={classes.link}>Reference</a>
            </ListItemText>
          </Link>
        </MenuItem>
        <Divider />
        <MenuItem>
          <Link href={'../../learner-profile-edit/job-experience/null'}>
            <ListItemText>
              <a className={classes.link}>Job Experience</a>
            </ListItemText>
          </Link>
        </MenuItem>
        <Divider />
        <MenuItem>
          <Link href={'../../learner-profile-edit/language/null'}>
            <ListItemText>
              <a className={classes.link}>Language</a>
            </ListItemText>
          </Link>
        </MenuItem>
        <Divider />
        <MenuItem>
          <Link href={'../../learner-profile-edit/portfolio/null'}>
            <ListItemText>
              <a className={classes.link}>Portfolio</a>
            </ListItemText>
          </Link>
        </MenuItem>
      </MenuList>
    </StyledPaper>
  );
};

export default YouthProfileNavigationSidebar;
