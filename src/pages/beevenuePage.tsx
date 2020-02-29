import React from "react";
import { Sidebar } from "../fragments/sidebar";

import { NotificationsPanel } from "../fragments/panels/notificationsPanel";

export const BeevenuePage = (props: any) => {
  return (
    <div>
      <section className="section">
        <div className="columns">
          <div className="column is-narrow">
            <Sidebar {...props} />
          </div>
          <div className="column">
            <NotificationsPanel />
            {props.children}
          </div>
        </div>
      </section>
    </div>
  );
};
