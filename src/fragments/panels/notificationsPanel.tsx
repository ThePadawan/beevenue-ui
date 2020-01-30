import React, { Component } from "react";
import { connect } from "react-redux";
import { getNotifications } from "../../redux/reducers/notifications";
import { dismissNotification, dismissAllNotifications } from "../../redux/actions";

import {
  BeevenueNotificationId,
  BeevenueNotificationMap,
  BeevenueNotificationLevel
} from "../../notifications";

interface NotificationsPanelProps {
  dismissAll: typeof dismissAllNotifications;
  dismissNotification: typeof dismissNotification;
  notifications: BeevenueNotificationMap;
}

class NotificationsPanel extends Component<NotificationsPanelProps, any, any> {
  public constructor(props: any) {
    super(props);
    this.state = { notifications: [] };
  }

  public dismiss(id: BeevenueNotificationId): void {
    this.props.dismissNotification(id);
  }

  public dismissAll(): void {
    this.props.dismissAll();
  }

  public classFor(level: BeevenueNotificationLevel): string {
    const dict = {
      error: "is-danger",
      warning: "is-warning",
      info: "is-info"
    };

    return "beevenue-notification notification " + dict[level];
  }

  render() {
    const notifications = this.getNotificationElements();
    const maybeDismissAll = this.getDismissAllLink(notifications.length);

    return (
      <div className="beevenue-notifications-outer">
        <div className="beevenue-notifications-dismiss-all">
          {maybeDismissAll}
        </div>
        <div className="beevenue-notifications">
          {notifications}
        </div>
      </div>
    );
  }

  private getNotificationElements() {
    const notifications: JSX.Element[] = [];
    for (let [key, value] of Object.entries(this.props.notifications)) {
      const el = (<div className={this.classFor(value.level)} key={key}>
        <button className="delete" key={key} onClick={_ => this.dismiss(key)} />
        {value.timestamp.toLocaleTimeString()} {value.content}
      </div>);
      notifications.push(el);
    }
    return notifications;
  }

  private getDismissAllLink(notificationCount: number): JSX.Element | null {
    if (notificationCount > 0) {
      return <a href="#" className="beevenue-notifications-dismiss-all-link" onClick={_ => this.dismissAll()}>Dismiss all
      </a>;
    }

    return null;
  }
}

const mapStateToProps = (state: any) => {
  return { notifications: getNotifications(state.notifications) };
};

const x = connect(mapStateToProps, { dismissNotification, dismissAll: dismissAllNotifications })(NotificationsPanel);
export { x as NotificationsPanel };
