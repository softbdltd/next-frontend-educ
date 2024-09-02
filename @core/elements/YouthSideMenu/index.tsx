import {
  CastForEducation,
  ContactPage,
  PersonOutline,
  Settings,
  Today,
  Work,
} from '@mui/icons-material';
import {
  Card,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
} from '@mui/material';
import React from 'react';
import {useIntl} from 'react-intl';
import {
  LINK_FRONTEND_LEARNER_CALENDAR,
  LINK_FRONTEND_LEARNER_MY_COURSES,
  LINK_FRONTEND_LEARNER_MY_CV,
  LINK_FRONTEND_LEARNER_MY_JOBS,
  LINK_FRONTEND_LEARNER_ROOT,
  LINK_FRONTEND_LEARNER_TRAINING,
} from '../../common/appLinks';
import {Link} from '../common';

const SideMenu: any = () => {
  const {messages} = useIntl();

  return (
    <Card>
      <MenuList>
        <Link href={LINK_FRONTEND_LEARNER_ROOT}>
          <MenuItem>
            <ListItemIcon>
              <PersonOutline />
            </ListItemIcon>
            <ListItemText>
              {messages['learner_feed_menu.my_profile']}
            </ListItemText>
          </MenuItem>
        </Link>

        <Divider />
        <Link href={LINK_FRONTEND_LEARNER_MY_CV}>
          <MenuItem>
            <ListItemIcon>
              <ContactPage />
            </ListItemIcon>
            <ListItemText>{messages['learner_feed_menu.my_cv']}</ListItemText>
          </MenuItem>
        </Link>
        <Divider />
        <Link href={LINK_FRONTEND_LEARNER_MY_COURSES}>
          <MenuItem>
            <ListItemIcon>
              <CastForEducation />
            </ListItemIcon>
            <ListItemText>
              {messages['learner_feed_menu.my_courses']}
            </ListItemText>
          </MenuItem>
        </Link>
        <Divider />
        <Link href={`${LINK_FRONTEND_LEARNER_TRAINING}?is_offline=1`}>
          <MenuItem>
            <ListItemIcon>
              <CastForEducation />
            </ListItemIcon>
            <ListItemText>{messages['common.online']}</ListItemText>
          </MenuItem>
        </Link>
        <Divider />
        <Link href={LINK_FRONTEND_LEARNER_MY_JOBS}>
          <MenuItem>
            <ListItemIcon>
              <Work />
            </ListItemIcon>
            <ListItemText>{messages['learner_feed_menu.my_jobs']}</ListItemText>
          </MenuItem>
        </Link>
        {/*<Divider />
        <Link href={LINK_FRONTEND_LEARNER_ROOT}>
          <MenuItem>
            <ListItemIcon>
              <Folder />
            </ListItemIcon>
            <ListItemText>{messages['learner_feed_menu.my_locker']}</ListItemText>
          </MenuItem>
        </Link>*/}
        <Divider />
        <Link href={LINK_FRONTEND_LEARNER_CALENDAR}>
          <MenuItem>
            <ListItemIcon>
              <Today />
            </ListItemIcon>
            <ListItemText>
              {messages['learner_feed_menu.my_calender']}
            </ListItemText>
          </MenuItem>
        </Link>
        <Divider />
        {/*<Link href={LINK_FRONTEND_LEARNER_FREELANCE_CORNER}>*/}
        {/*  <MenuItem>*/}
        {/*    <ListItemIcon>*/}
        {/*      <LaptopMac />*/}
        {/*    </ListItemIcon>*/}
        {/*    <ListItemText>*/}
        {/*      {messages['learner_feed_menu.freelance_corner']}*/}
        {/*    </ListItemText>*/}
        {/*  </MenuItem>*/}
        {/*</Link>*/}
        {/*<Divider />*/}
        <Link href={LINK_FRONTEND_LEARNER_ROOT}>
          <MenuItem>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText>{messages['learner_feed_menu.settings']}</ListItemText>
          </MenuItem>
        </Link>
      </MenuList>
    </Card>
  );
};

export default SideMenu;
