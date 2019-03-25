import React, { Component } from "react";
import { connect } from "react-redux";
import { getNotifications } from "../../redux/reducers/notifications";
import { dismissNotification } from "../../redux/actions";

import {
  BeevenueNotificationId,
  BeevenueNotificationMap,
  BeevenueNotificationLevel
} from "../../notifications";

interface NotificationsPanelProps {
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

  public classFor(level: BeevenueNotificationLevel): string {
    const dict = {
      error: "is-danger",
      warning: "is-warning",
      info: "is-info"
    };

    return "notification " + dict[level];
  }

  render() {
    const notifications: any[] = [];
    for (let [key, value] of Object.entries(this.props.notifications)) {
      const el = (
        <div className={this.classFor(value.level)} key={key}>
          <button
            className="delete"
            key={key}
            onClick={_ => this.dismiss(key)}
          />
          {value.timestamp.toLocaleTimeString()} {value.content}
        </div>
      );
      notifications.push(el);
    }

    return <div className="beevenue-notifications">{notifications}</div>;
  }
}

const mapStateToProps = (state: any) => {
  return { notifications: getNotifications(state.notifications) };
};

const x = connect(
  mapStateToProps,
  { dismissNotification }
)(NotificationsPanel);
export { x as NotificationsPanel };
