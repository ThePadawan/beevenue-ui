import React, { Component } from "react";

import { Api } from "../api/api";
import { NeedsLoginPage } from "./needsLoginPage";
import { BeevenueSpinner } from "../fragments/beevenueSpinner";

import { displayText, Rule } from "./rules";
import { RuleFileUploadCard } from "../fragments/rules/ruleFileUploadCard";
import { RuleFileDownloadCard } from "../fragments/rules/ruleFileDownloadCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

interface RulesPageState {
  rules: any[] | null;
}

class RulesPage extends Component<any, RulesPageState, any> {
  public constructor(props: any) {
    super(props);
    this.state = { rules: null };
  }

  public componentDidMount = () => {
    this.loadRules();
  };

  private onRuleFileUploaded = () => {
    this.loadRules();
  };

  private deleteRule = (ruleIndex: number) => {
    Api.Rules.delete(ruleIndex).then(_ => this.loadRules());
  };

  private getRules = (rules: Rule[]) => {
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
                  <footer className="card-footer">
                    <a
                      className="card-footer-item"
                      onClick={e => this.deleteRule(idx)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      Delete
                    </a>
                  </footer>
                </div>
              </div>
            </nav>
          );
        })}
      </>
    );
  };

  private loadRules() {
    Api.Rules.get().then(res => {
      this.setState({ rules: res.data });
    });
  }

  render() {
    let content: JSX.Element;
    if (this.state.rules === null) {
      content = <BeevenueSpinner />;
    } else {
      content = this.getRules(this.state.rules);
    }

    return (
      <NeedsLoginPage>
        <h2 className="title is-2">Rules</h2>
        <h3 className="title is-3">File</h3>
        <RuleFileUploadCard onUploaded={() => this.onRuleFileUploaded()} />
        <RuleFileDownloadCard />
        <h3 className="title is-3">Current rules</h3>
        {content}
      </NeedsLoginPage>
    );
  }
}

export { RulesPage };
