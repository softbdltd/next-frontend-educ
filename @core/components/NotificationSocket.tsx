import React, {useContext, useEffect, useState} from 'react';
import {
  NotificationContext,
  NotificationContextPropsType,
} from '../contexts/notification/NotificationProvider';
import {useAuthUser} from '../../@core/utility/AppHooks';
import io, {Socket} from 'socket.io-client';
import {NOTIFICATION_SOCKET_SERVER_URL} from '../common/apiRoutes';
import {useFetchUnseenNotificationCount} from '../../services/NotificationManagement/hook';

const NOTIFICATION_ENABLED: boolean =
  typeof process.env.NEXT_PUBLIC_NOTIFICATION_ENABLED !== 'undefined'
    ? process.env.NEXT_PUBLIC_NOTIFICATION_ENABLED == 'true'
    : false;

const socket: Socket | null = NOTIFICATION_ENABLED
  ? io(NOTIFICATION_SOCKET_SERVER_URL)
  : null;

const NotificationSocket: React.FC<React.ReactNode> = ({children}) => {
  const authUser = useAuthUser();
  const {notificationCount, updateNotificationCount, resetNotificationCount} =
    useContext<NotificationContextPropsType>(NotificationContext);
  const [count, setCount] = useState<number>(0);

  // Notification count
  const {data: notificationCountData, isLoading: isLoadingCount} =
    useFetchUnseenNotificationCount(authUser?.idp_user_id ?? '');

  /*const audioPlayer: any = useRef(null);

  function playAudio() {
    if (audioPlayer) audioPlayer?.current?.play();
  }

  let audio = new Audio('/audio/notification-sound.mp3');
  audio.preload = 'none';
  */

  useEffect(() => {
    if (!isLoadingCount && notificationCountData) {
      setCount(notificationCountData);
    }
  }, [notificationCountData, isLoadingCount]);

  useEffect(() => {
    if (socket) {
      console.log('socket connecting-> idp_user_id-> ', authUser?.idp_user_id);
      if (authUser?.idp_user_id) {
        socket.on('connect', () => {
          console.log('socket connected -> isConnected', socket.connected);
        });

        socket.on(authUser?.idp_user_id, (event) => {
          console.log('event-> ', event);
          setCount((prev) => prev + 1);
        });
      }
    }
  }, [authUser]);

  useEffect(() => {
    if (notificationCount != count && updateNotificationCount) {
      updateNotificationCount(count);
    }
  }, [count]);

  useEffect(() => {
    if (resetNotificationCount == 0 && count != 0) {
      console.log('Notification state reset');
      setCount(0);
    }
  }, [resetNotificationCount]);

  return (
    <>
      {children}
      {/*<audio
        ref={audioPlayer}
        src={'/audio/notification-sound.mp3'}
        preload={'auto'}
      />*/}
    </>
  );
};

export default NotificationSocket;
