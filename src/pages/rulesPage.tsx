import React, { Component } from "react";

import { Api } from "../api/api";
import { NeedsLoginPage } from "./needsLoginPage";
import { BeevenueSpinner } from "../fragments/beevenueSpinner";

import { displayText } from "./rules";

interface RulesPageState {
  rules: any[] | null;
}

class RulesPage extends Component<any, RulesPageState, any> {
  public constructor(props: any) {
    super(props);
    this.state = { rules: null };
  }

  public componentDidMount = () => {
    Api.getRules().then(res => {
      this.setState({ rules: res.data });
    });
  };

  private getRules = (rules: any[]) => {
    return (
      <>
        {rules.map((r, idx) => {
          return (
            <nav className="level" key={idx}>
              <div className="level-item">
                <div className="card beevenue-sidebar-card">
                  <header className="card-header">
                    <p className="card-header-title">Rule {idx + 1}</p>
                  </header>
                  <div className="card-content">
                    <div className="content">{displayText(r)}</div>
                  </div>
                </div>
              </div>
            </nav>
          );
        })}
      </>
    );
  };

  render() {
    let content: JSX.Element;
    if (this.state.rules === null) {
      content = <BeevenueSpinner />;
    } else {
      content = this.getRules(this.state.rules);
    }

    return (
      <NeedsLoginPage>
        <h2 className="title">Rules</h2>
        {content}
      </NeedsLoginPage>
    );
  }
}

export { RulesPage };
