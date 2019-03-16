import React, { Component } from "react";
import { Sidebar } from "../fragments/sidebar";
import { Location } from "history";

import { NotificationsPanel } from "../fragments/panels/notificationsPanel";

export interface BeevenuePageProps {
  location: Location;
}

export abstract class BeevenuePage<
  P extends BeevenuePageProps,
  S = any,
  SS = any
> extends Component<P, S, SS> {
  render() {
    const { children } = this.props;
    return (
      <div>
        <section className="section">
          <div className="columns">
            <div className="column is-narrow">
              <Sidebar {...this.props} />
            </div>
            <div className="column">
              <NotificationsPanel />
              {children}
            </div>
          </div>
        </section>
      </div>
    );
  }
}
