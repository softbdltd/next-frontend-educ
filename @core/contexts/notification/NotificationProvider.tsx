import React, {useReducer} from 'react';
import {notificationReducer, NotificationSetting} from './NotificationReducer';

export interface NotificationContextPropsType {
  notificationCount: number;
  resetNotificationCount: number;
  updateNotificationCount?: (count: number) => void;

  [x: string]: any;
}

export const NotificationContext =
  React.createContext<NotificationContextPropsType>({
    notificationCount: 0,
    resetNotificationCount: 0,
  });

const NotificationProvider: React.FC<React.ReactNode> = ({children}) => {
  const defaultValue = {
    notificationCount: 0,
    resetNotificationCount: 0,
  };

  const [state, dispatch] = useReducer(
    notificationReducer,
    defaultValue,
    () => defaultValue,
  );

  const updateNotificationCount = (count: number) => {
    dispatch({type: NotificationSetting.UPDATE_NOTIFICATION, payload: count});
  };

  return (
    <NotificationContext.Provider
      value={{
        ...state,
        updateNotificationCount,
      }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
