import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {styled} from '@mui/material/styles';
import {Box, List, Paper, Typography} from '@mui/material';

import {useFetchNotifications} from '../../../services/NotificationManagement/hook';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {useIntl} from 'react-intl';

import {
  markAllNotificationAsSeen,
  markNotificationAsRead,
} from '../../../services/NotificationManagement/NotificationServices';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';
import NotificationItem from '../../../@core/core/Notifications/NotificationItem';
import {INotificationItem} from '../../../@core/services/db/notifications/notification';
import NoDataFoundComponent from '../../learner/common/NoDataFoundComponent';
import PageSizes from '../../../@core/utilities/PageSizes';
import {LoadingButton} from '@mui/lab';
import {
  NotificationContext,
  NotificationContextPropsType,
} from '../../../@core/contexts/notification/NotificationProvider';

const PREFIX = 'Notification';

const classes = {
  searchBox: `${PREFIX}-searchBox`,
  searchInputBorderHide: `${PREFIX}-searchInputBorderHide`,
  searchButton: `${PREFIX}-searchButton`,
  list: `${PREFIX}-list`,
  notificationBox: `${PREFIX}-notificationBox`,
  card: `${PREFIX}-card`,
  button: `${PREFIX}-button`,
  active: `${PREFIX}-active`,
  loadingButton: `${PREFIX}-loadingButton`,
};

const StyledPaper = styled(Paper)(({theme}) => ({
  height: '100%',
  [`& .${classes.searchBox}`]: {
    padding: '10px 5px 5px',
    alignItems: 'center',
    marginTop: 10,
  },

  [`& .${classes.searchInputBorderHide}`]: {
    '& fieldset': {
      border: 'none',
    },
    '& input': {
      padding: '14px 0px',
    },
  },

  [`& .${classes.list}`]: {
    paddingTop: 0,
    paddingBottom: 0,
  },

  [`& .${classes.notificationBox}`]: {
    marginTop: 20,
  },

  [`& .${classes.card}`]: {
    marginTop: 0,
  },

  [`& .${classes.button}`]: {
    padding: '.2rem 1rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: '350px',
    borderTopLeftRadius: '350px',
    borderBottomRightRadius: '350px',
    borderTopRightRadius: '350px',
    fontSize: '12px',
    margin: '0px .3rem',
    userSelect: 'none',
    cursor: 'pointer',
    '& p': {
      padding: 0,
    },
    color: '#ffffff',
    backgroundColor: '#c4c4c4',
    '&:hover': {
      color: '#ffffff',
      backgroundColor: '#b4b1b1',
      transform: 'scale(0.99)',
    },
  },

  [`& .${classes.active}`]: {
    color: '#e9f4ee',
    backgroundColor: '#048340',
    '&:hover': {
      color: '#eef8f3',
      backgroundColor: '#097e41',
      transform: 'scale(0.99)',
    },
  },

  [`& .${classes.loadingButton}`]: {
    [`&.Mui-disabled`]: {
      borderColor: `${theme.palette.primary.light}`,
    },
    [`& .MuiLoadingButton-loadingIndicator`]: {
      color: `${theme.palette.primary.main}`,
    },
  },
}));

const Notification = () => {
  const {messages} = useIntl();
  const authUser = useAuthUser<CommonAuthUser>();

  const [isFilterByUnseen, setIsFilterByUnseen] = useState<boolean>(false);
  const page = useRef<number>(1);

  const {notificationCount, updateNotificationCount} =
    useContext<NotificationContextPropsType>(NotificationContext);
  const [notifications, setNotifications] = useState<any>([]);
  const [filterParams, setFilterParams] = useState<any>({
    page: 1,
    page_size: PageSizes.TEN,
  });

  const {
    data: fetchedNotifications,
    mutate: notificationMutate,
    isLoading: isLoadingNotification,
  } = useFetchNotifications(authUser?.idp_user_id ?? '', filterParams);

  const setFetchedNotification = () => {
    if (!isLoadingNotification && fetchedNotifications) {
      if (page.current == 1) {
        setNotifications(fetchedNotifications);
      } else {
        setNotifications((prev: any) => {
          return [...prev, ...fetchedNotifications];
        });
      }
    } else {
    }
  };

  useEffect(() => {
    if (isLoadingNotification) return;

    if (notificationCount > 0) {
      markAllNotificationAsSeen(authUser?.idp_user_id ?? '');
      if (updateNotificationCount) {
        updateNotificationCount(0);
      }
      setFetchedNotification();
    } else setFetchedNotification();
  }, [fetchedNotifications, isLoadingNotification]);

  const handleShowNotification = useCallback((item: INotificationItem) => {
    try {
      markNotificationAsRead(item._id, authUser?.idp_user_id ?? '').then(() =>
        notificationMutate(),
      );
    } catch (error: any) {
      console.error(error);
    }
  }, []);

  const showAllNotifications = useCallback(() => {
    page.current = 1;
    setFilterParams((prev: any) => {
      delete prev.is_read;
      return {
        ...prev,
        page: 1,
      };
    });
    setIsFilterByUnseen(false);
  }, []);

  const showUnseenNotifications = useCallback(() => {
    page.current = 1;
    setFilterParams((prev: any) => {
      return {
        ...prev,
        is_read: false,
        page: 1,
      };
    });
    setIsFilterByUnseen(true);
  }, []);

  const loadMore = () => {
    page.current = notificationCount != 0 ? page.current : page.current + 1;
    setFilterParams((prev: any) => {
      return {
        ...prev,
        page: page.current,
      };
    });
  };

  return (
    <StyledPaper className={classes.notificationBox}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          padding: '1rem',
        }}>
        <Typography variant={'h6'} sx={{marginRight: '1.5rem'}}>
          {messages['common.notifications']}
        </Typography>
        <Box sx={{display: 'flex', flexDirection: 'row'}}>
          <Typography
            onClick={showAllNotifications}
            className={`${classes.button} ${
              isFilterByUnseen ? '' : classes.active
            }`}>
            <IntlMessages id='common.all' />
          </Typography>
          <Typography
            onClick={showUnseenNotifications}
            className={`${classes.button} ${
              isFilterByUnseen ? classes.active : ''
            }`}>
            <IntlMessages id='learner.notification_unread' />
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          height: 'calc(100% - 67px)',
          overflow: 'auto',
        }}>
        {notifications && notifications.length > 0 ? (
          <List className={classes.list}>
            {notifications.map((item: INotificationItem, index: number) => (
              <NotificationItem
                item={item}
                key={index}
                onNotificationItemClick={handleShowNotification}
              />
            ))}
          </List>
        ) : (
          <NoDataFoundComponent
            messageTextType={'h6'}
            sx={{
              padding: '80px 0px',
              justifyContent: 'center',
            }}
          />
        )}
      </Box>
      {notifications.length > 0 && (
        <Box
          sx={{
            padding: '15px 0px',
            textAlign: 'center',
            borderTop: '1px solid #c4c4c4',
          }}>
          <LoadingButton
            variant={'outlined'}
            color={'primary'}
            size={'small'}
            className={classes.loadingButton}
            loading={isLoadingNotification}
            disabled={fetchedNotifications?.length == 0}
            onClick={() => {
              loadMore();
            }}>
            {messages['common.load_more']}
          </LoadingButton>
        </Box>
      )}
    </StyledPaper>
  );
};

export default Notification;
