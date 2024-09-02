export const NotificationSetting = {
  UPDATE_NOTIFICATION: 'UPDATE_NOTIFICATION',
};

export function notificationReducer(state: any, action: any) {
  switch (action.type) {
    case NotificationSetting.UPDATE_NOTIFICATION: {
      return {
        ...state,
        notificationCount: action.payload,
        resetNotificationCount: action.payload,
      };
    }
    default:
      return state;
  }
}
