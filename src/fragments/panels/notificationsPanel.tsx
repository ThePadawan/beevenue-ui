import React, { Component, Ref } from "react";
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
    const notis: any[] = [];
    for (let [key, value] of Object.entries(this.props.notifications)) {
      const el = (
        <div className={this.classFor(value.level)} key={key}>
          <button
            className="delete"
            key={key}
            onClick={_ => this.dismiss(key)}
          />
          <a>{value.timestamp.toLocaleTimeString()}</a> {value.content}
        </div>
      );
      notis.push(el);
    }

    return <div>{notis}</div>;
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
