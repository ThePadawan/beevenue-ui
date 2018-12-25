import React, { Component } from "react";
import { Sidebar } from "../fragments/sidebar";

import { NotificationsPanel } from "../fragments/panels/notificationsPanel";

export abstract class BeevenuePage<
  P = any,
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
              <Sidebar />
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
