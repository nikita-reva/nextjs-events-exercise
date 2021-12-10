import React, { Fragment, useContext } from 'react';
import NotificationContext from '../../store/notification-context';
import Notification from '../ui/Notification';
import MainHeader from './MainHeader';

function Layout({ children }) {
  const notificationCtx = useContext(NotificationContext);

  const activeNotification = notificationCtx.notification;

  return (
    <Fragment>
      <MainHeader />
      <main>{children}</main>
      {activeNotification && (
        <Notification
          title={activeNotification.title}
          message={activeNotification.message}
          status={activeNotification.status}
        />
      )}
    </Fragment>
  );
}

export default Layout;
